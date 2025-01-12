import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Edit2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../common/Button';
import EditProfileModal from './EditProfileModal';

interface User {
  id: string;
  username: string;
  type: string;
  bio?: string;
  country?: string;
  profile_image_url?: string;
}

interface ProfileHeaderProps {
  onUpdateProfile?: (data: {
    username?: string;
    bio?: string;
    profileImage?: string;
  }) => void;
}

export default function ProfileHeader({ onUpdateProfile }: ProfileHeaderProps) {
  const { user, fetchUserFromSupabase } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserFromSupabase(user.id);
    }
  }, []);

  const handleProfileUpdate = async (data: {
    username?: string;
    bio?: string;
    profileImage?: string;
  }) => {
    if (user?.id) {
      await fetchUserFromSupabase(user.id);
      if (onUpdateProfile) {
        onUpdateProfile(data);
      }
    }
    setShowEditModal(false);
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-24">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user.profile_image_url && !imageError ? (
              <img
                src={user.profile_image_url}
                alt={`${user.username}'s profile`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {user.username?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
            onClick={() => setShowEditModal(true)}
            aria-label="Edit profile picture"
          >
            <Camera size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h2>
              {user.type && (
                <p className="text-gray-500 capitalize">{user.type}</p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(true)}
              aria-label="Edit profile details"
            >
              <Edit2 size={16} className="mr-2" aria-hidden="true" />
              Edit Profile
            </Button>
          </div>

          {user.bio && (
            <p className="mt-2 text-gray-600">
              {user.bio}
            </p>
          )}

          {user.country && (
            <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
              <MapPin size={16} className="mr-1" aria-hidden="true" />
              <span>{user.country}</span>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          currentUsername={user.username}
          currentBio={user.bio}
          currentImage={user.profile_image_url}
          id={user.id}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
}