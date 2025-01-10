import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileContent from '../components/profile/ProfileContent';

export default function Profile() {
  const { userId } = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('posts');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string>();

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id;

  const handleUpdateProfile = (data: { bio?: string; profileImage?: string }) => {
    setBio(data.bio || '');
    setProfileImage(data.profileImage);
  };

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