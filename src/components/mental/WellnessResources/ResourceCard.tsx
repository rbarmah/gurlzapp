import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  category: string;
  readTime: string;
  url: string;
}

export default function ResourceCard({ title, description, category, readTime, url }: ResourceCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">{category}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{readTime} read</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}