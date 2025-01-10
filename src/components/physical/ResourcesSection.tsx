import React, { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const resources = [
  {
    id: '1',
    title: 'Beginner\'s Guide to Weight Training',
    category: 'Exercise',
    readTime: '8 min read'
  },
  {
    id: '2',
    title: 'Understanding Macro and Micronutrients',
    category: 'Nutrition',
    readTime: '6 min read'
  },
  {
    id: '3',
    title: 'The Importance of Rest and Recovery',
    category: 'Wellness',
    readTime: '5 min read'
  },
  {
    id: '4',
    title: 'Cardio vs. Strength Training',
    category: 'Exercise',
    readTime: '7 min read'
  }
];

export default function ResourcesSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-primary mb-6">Physical Health Resources</h2>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-4">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{resource.title}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-primary">{resource.category}</span>
                  <span className="text-sm text-gray-500">{resource.readTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}