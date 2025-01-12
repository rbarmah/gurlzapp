import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileContent from '../components/profile/ProfileContent';

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, fetchUserFromSupabase } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  // Check and refresh auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }

        // If we have a session but no current user, fetch the user data
        if (session && !currentUser) {
          await fetchUserFromSupabase(session.user.id);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [currentUser, fetchUserFromSupabase, navigate]);

  // Setup real-time subscription for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      } else if (session && !currentUser) {
        await fetchUserFromSupabase(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser, fetchUserFromSupabase, navigate]);

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id;

  const handleUpdateProfile = (data: { bio?: string; profileImage?: string }) => {
    setBio(data.bio || '');
    setProfileImage(data.profileImage);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || !profileUserId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view this profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p className="text-secondary-light/90">View and manage your profile</p>
      </div>

      {/* Profile Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <ProfileHeader
          user={currentUser}
          isOwnProfile={isOwnProfile}
          bio={bio}
          profileImage={profileImage}
          onUpdateProfile={handleUpdateProfile}
        />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOwnProfile={isOwnProfile}
          />

          <ProfileContent 
            activeTab={activeTab}
            userId={profileUserId}
          />
        </div>
      </motion.div>
    </div>
  );
}