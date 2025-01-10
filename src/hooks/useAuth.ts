import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { SignupData, AuthResponse } from '../types/auth';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: loginStore, logout: logoutStore } = useAuthStore();

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        loginStore({
          id: data.user.id,
          email: data.user.email!,
          username: profile.username,
          gender: profile.gender,
          country: profile.country,
          phoneNumber: profile.phone_number || '',
          dateJoined: new Date(profile.created_at),
          type: profile.user_type
        });

        navigate('/dashboard');
        return { success: true, data: profile };
      }

      throw new Error('No user data returned');
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

 const signUp = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          gender: userData.gender,
          country: userData.country,
          phone_number: userData.phoneNumber,
          age_group: userData.ageGroup,  // Add this line
          user_type: userData.type || 'individual'
        }
      }
    });
 
      if (error) throw error;

      if (data.user) {
        // Wait for profile to be created by trigger
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          return { success: true, data: { id: data.user.id } };
        }
      }

      throw new Error('Failed to create profile');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      logoutStore();
      navigate('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  return {
    loading,
    error,
    signIn,
    signUp,
    logout
  };
}