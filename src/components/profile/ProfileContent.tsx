import React, { useEffect, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import PostsGrid from './PostsGrid';
import ChatHistory from './ChatHistory';
import ActivityTimeline from './ActivityTimeline';
import { Lock } from 'lucide-react';

interface ProfileContentProps {
  activeTab: string;
  userId: string;
}

export default function ProfileContent({ activeTab, userId }: ProfileContentProps) {
  const { user, fetchUserFromSupabase } = useAuthStore();
  const { activities, chatHistory = [], fetchChatHistory } = useProfileStore();

  const isOwnProfile = user?.id === userId;

  // Fetch user data if not loaded
  useEffect(() => {
    if (!user && userId) {
      fetchUserFromSupabase(userId);
    }
  }, [user, userId, fetchUserFromSupabase]);

  // Fetch chat history only when viewing own profile and chats tab is active
  useEffect(() => {
    if (activeTab === 'chats' && isOwnProfile) {
      console.log('Fetching chat history for own profile:', userId);
      fetchChatHistory(userId);
    }
  }, [activeTab, isOwnProfile, userId, fetchChatHistory]);

  // Debug log chat history updates
  useEffect(() => {
    console.log('Current chat history:', chatHistory);
  }, [chatHistory]);

  // Memoized filtered activities
  const filteredActivities = useMemo(
    () => activities.filter((activity) => activity.userId === userId),
    [activities, userId]
  );

  const renderPrivateContent = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Lock className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Private Content</h3>
      <p className="text-gray-500 text-center max-w-sm">
        This content is private and can only be viewed by the profile owner.
      </p>
    </div>
  );

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'posts':
        return filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts yet</div>
        ) : (
          <PostsGrid posts={filteredActivities} />
        );

      case 'chats':
        if (!isOwnProfile) {
          return renderPrivateContent();
        }
        
        if (chatHistory.length === 0) {
          return (
            <div className="text-center py-8 text-gray-500">
              <p>No chat history available</p>
              <p className="text-sm mt-2">Your chat messages and replies will appear here</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Chat History</h3>
            </div>
            <ChatHistory 
              chats={chatHistory}
            />
          </div>
        );

      case 'activity':
        if (!isOwnProfile) {
          return renderPrivateContent();
        }

        return filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
            <p className="text-sm mt-2">Your activities will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Activity Timeline</h3>
            </div>
            <ActivityTimeline activities={filteredActivities} />
          </div>
        );

      default:
        return null;
    }
  }, [activeTab, filteredActivities, chatHistory, isOwnProfile]);

  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {renderContent}
    </div>
  );
}