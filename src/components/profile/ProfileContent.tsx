import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useFashionStore } from '../../store/fashionStore';
import { useChatStore } from '../../store/chatStore';
import { useActivityStore } from '../../store/activityStore';
import PostsGrid from './PostsGrid';
import ChatHistory from './ChatHistory';
import ActivityTimeline from './ActivityTimeline';

interface ProfileContentProps {
  activeTab: string;
  userId: string;
}

export default function ProfileContent({ activeTab, userId }: ProfileContentProps) {
  const currentUser = useAuthStore(state => state.user);
  const isOwnProfile = currentUser?.id === userId;
  
  const posts = useFashionStore(state => 
    state.posts.filter(post => post.author.id === userId)
  );
  
  const messages = useChatStore(state => 
    state.messages.filter(msg => msg.author.id === userId)
  );
  
  const activities = useActivityStore(state => 
    state.getActivitiesByUser(userId)
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return <PostsGrid posts={posts} />;
      case 'chats':
        return isOwnProfile ? <ChatHistory chats={messages} /> : null;
      case 'activity':
        return isOwnProfile ? <ActivityTimeline activities={activities} /> : null;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {renderContent()}
    </motion.div>
  );
}