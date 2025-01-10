import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import LoginHeader from './LoginHeader';
import LoginInput from './LoginInput';
import Button from '../../common/Button';
import ForgotPasswordModal from '../ForgotPasswordModal';
import { AnimatePresence } from 'framer-motion';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    const { success } = await signIn(email, password);
    if (!success) {
      // Error is handled by useAuth hook
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader />

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-in">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <LoginInput
              icon={UserCircle2}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={loading}
            />

            <LoginInput
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary hover:text-primary-light font-medium transition-colors"
              >
                Join Us
              </button>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForgotPassword && (
          <ForgotPasswordModal
            onClose={() => setShowForgotPassword(false)}
            onSubmit={async (email) => {
              // Handle password reset
              console.log('Reset password for:', email);
              setShowForgotPassword(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}