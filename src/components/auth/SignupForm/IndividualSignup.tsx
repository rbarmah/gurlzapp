import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button';
import SignupFormFields from './components/SignupFormFields';
import { FaceVerificationStep } from './components/FaceVerificationStep';

export default function IndividualSignup() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  country: '',
  phoneNumber: '',
  ageGroup: '' as AgeGroup  // Add this line
});

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  setError('');

  try {
    const { success, error, data } = await signUp({
      email: formData.email,
      password: formData.password,
      username: formData.username,
      gender: formData.gender as 'female' | 'male',
      country: formData.country,
      phoneNumber: formData.phoneNumber,
      ageGroup: formData.ageGroup, // Add this line to include ageGroup
      type: 'individual'
    });

    if (success && data?.id) {
      setUserId(data.id);
      setStep(2);
    } else {
      throw new Error(error || 'Failed to sign up');
    }
  } catch (err: any) {
    setError(err.message);
  }
};

  const handleVerificationComplete = (success: boolean) => {
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Face verification failed. Please try again.');
      setStep(1);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-6">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <SignupFormFields
                formData={formData}
                onChange={handleFieldChange}
                disabled={loading}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Continue to Face Verification'}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="face-verification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {userId && (
              <FaceVerificationStep 
                userId={userId}
                onComplete={handleVerificationComplete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}