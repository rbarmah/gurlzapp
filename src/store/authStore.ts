import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { AgeGroup } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // Added loading state
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  fetchUserFromSupabase: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false, // Initialize loading state
      error: null,

      login: (user) => {
        console.log('Logging in user:', user);
        set({ user, isAuthenticated: true, error: null, loading: false });
      },

      logout: async () => {
        console.log('Logging out user.');
        set({ loading: true }); // Set loading during logout
        try {
          await supabase.auth.signOut();
          localStorage.removeItem('auth_token');
          set({ user: null, isAuthenticated: false, error: null, loading: false });
        } catch (error) {
          console.error('Logout error:', error);
          set({ user: null, isAuthenticated: false, error: null, loading: false });
        }
      },

      updateProfile: (updates) => {
        console.log('Updating profile:', updates);
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      fetchUserFromSupabase: async (userId) => {
        console.log('Fetching user data for userId:', userId);

        // Prevent repeated fetching
        const { user } = get();
        if (user?.id === userId) {
          console.log('User data already fetched. Skipping re-fetch.');
          return;
        }

        set({ loading: true });

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select(`
              id,
              email,
              username,
              gender,
              country,
              phone_number,
              age_group,
              profile_image_url,
              bio
            `)
            .eq('id', userId)
            .single();

          if (error) throw error;

          if (!data) {
            console.warn('No user data found for userId:', userId);
            set({ user: null, isAuthenticated: false, error: 'No user data found', loading: false });
            return;
          }

          const userData: User = {
            id: data.id,
            email: data.email,
            username: data.username,
            gender: data.gender,
            country: data.country,
            phoneNumber: data.phone_number,
            ageGroup: data.age_group as AgeGroup,
            profileImage: data.profile_image_url,
            bio: data.bio,
          };

          console.log('Fetched user data:', userData);
          set({ user: userData, isAuthenticated: true, error: null, loading: false });
        } catch (error) {
          console.error('Error during fetchUserFromSupabase:', error);
          set({ user: null, isAuthenticated: false, error: 'Failed to fetch user data', loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);