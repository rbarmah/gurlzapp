import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, ShoppingBag, Bookmark, Image } from 'lucide-react';
import { UserActivity } from '../../types/profile';
import { formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  activities: UserActivity[];
}

const activityIcons = {
  post: { icon: Image, color: 'text-blue-500 bg-blue-50' },
  like: { icon: Heart, color: 'text-red-500 bg-red-50' },
  chat: { icon: MessageCircle, color: 'text-green-500 bg-green-50' },
  purchase: { icon: ShoppingBag, color: 'text-purple-500 bg-purple-50' },
  save: { icon: Bookmark, color: 'text-yellow-500 bg-yellow-50' }
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const { icon: Icon, color } = activityIcons[activity.type as keyof typeof activityIcons];
        
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-gray-900">{activity.content}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}