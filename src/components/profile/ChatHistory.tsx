import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Lock } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryProps {
  chats: ChatMessage[];
}

export default function ChatHistory({ chats }: ChatHistoryProps) {
  if (chats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No chat history yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MessageCircle className="text-primary" size={20} />
              <h4 className="font-medium text-gray-900">
                {chat.isAnonymous ? 'Anonymous Message' : 'Message'}
              </h4>
              {chat.isAnonymous && (
                <Lock className="text-gray-400" size={16} />
              )}
            </div>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{chat.content}</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span>{chat.likes} likes</span>
            <span>{chat.comments.length} replies</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}