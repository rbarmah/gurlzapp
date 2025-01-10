import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  description: string;
  readTime: string;
  imageUrl: string;
  onClick: () => void;
}

export default function ArticleCard({ title, description, readTime, imageUrl, onClick }: ArticleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden cursor-pointer"
    >
      <div className="aspect-video relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <BookOpen size={16} className="mr-2" />
          {readTime} read
        </div>
      </div>
    </motion.div>
  );
}