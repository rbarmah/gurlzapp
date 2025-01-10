import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { login } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const { data } = await auth.getProfile();
          login(data);
        } catch (error) {
          console.warn('Auth check warning:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [login]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}