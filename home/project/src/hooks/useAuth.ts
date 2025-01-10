import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { SignupData, AuthResponse } from '../types/auth';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();

  const handleUser = useCallback(async (user: User | null) => {
    if (user) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          login({
            id: user.id,
            email: user.email!,
            username: profile.username,
            gender: profile.gender.toLowerCase(),
            country: profile.country,
            phoneNumber: profile.phone_number || '',
            dateJoined: new Date(profile.created_at),
            type: profile.user_type
          });
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError('Failed to load user profile. Please try again.');
        // Optionally, you can decide whether to logout or not
        // logout();
      }
    } else {
      logout();
    }
  }, [login, logout]);

  useEffect(() => {
    // Check active sessions and set up auth subscription
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUser(session.user);
      }
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUser(session.user);
      } else {
        handleUser(null);
      }
    });

    const subscription = data.subscription;

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [handleUser]);

  const signUp = async (data: SignupData): Promise<AuthResponse> => {
    try {
      // Log non-sensitive signup initiation
      console.log('Signup initiated for email:', data.email);

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            gender: data.gender.toLowerCase(),
            country: data.country,
            phone_number: data.phoneNumber,
            user_type: data.userType
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // Do not call login here. Wait for onAuthStateChange to handle it.

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  return {
    loading,
    error,
    signUp,
    signIn,
    signOut
  };
}
