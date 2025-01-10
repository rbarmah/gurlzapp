import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Edit2 } from 'lucide-react';
import { User } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Button from '../common/Button';
import EditProfileModal from './EditProfileModal';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  bio?: string;
  profileImage?: string;
  onUpdateProfile: (data: { username?: string; bio?: string; profileImage?: string }) => void;
}

export default function ProfileHeader({ 
  user, 
  isOwnProfile, 
  bio, 
  profileImage,
  onUpdateProfile 
}: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { updateProfile } = useAuthStore();

  const handleProfileUpdate = (data: { username?: string; bio?: string; profileImage?: string }) => {
    onUpdateProfile(data);
    if (data.username) {
      updateProfile({ username: data.username });
    }
    setShowEditModal(false);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {user.username[0].toUpperCase()}
              </span>
            )}
          </div>
          {isOwnProfile && (
            <button 
              className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-dark"
              onClick={() => setShowEditModal(true)}
            >
              <Camera size={16} />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-500 capitalize">{user.type}</p>
            </div>
            {isOwnProfile && (
              <Button 
                variant="outline"
                onClick={() => setShowEditModal(true)}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {bio && <p className="mt-2 text-gray-600">{bio}</p>}

          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            {user.country && (
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {user.country}
              </div>
            )}
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Joined {user.dateJoined.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          currentUsername={user.username}
          currentBio={bio}
          currentImage={profileImage}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
}