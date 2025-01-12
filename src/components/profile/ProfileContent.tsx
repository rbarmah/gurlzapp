import React, { useEffect, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import PostsGrid from './PostsGrid';
import ChatHistory from './ChatHistory';
import ActivityTimeline from './ActivityTimeline';

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

  // Fetch chat history when `chats` tab is active
  useEffect(() => {
    if (activeTab === 'chats' && isOwnProfile && chatHistory.length === 0) {
      fetchChatHistory(userId);
    }
  }, [activeTab, isOwnProfile, userId, chatHistory.length, fetchChatHistory]);

  // Memoized filtered activities
  const filteredActivities = useMemo(
    () => activities.filter((activity) => activity.userId === userId),
    [activities, userId]
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
        if (!isOwnProfile) return null;
        return chatHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No chat history available.</div>
        ) : (
          <ChatHistory chats={chatHistory} />
        );

      case 'activity':
        if (!isOwnProfile) return null;
        return filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No recent activity</div>
        ) : (
          <ActivityTimeline activities={filteredActivities} />
        );

      default:
        return null;
    }
  }, [activeTab, filteredActivities, chatHistory, isOwnProfile]);

  if (!user) {
    return <div className="text-center py-8 text-gray-500">Loading profile...</div>;
  }

  return <div className="bg-white p-6">{renderContent}</div>;
}
