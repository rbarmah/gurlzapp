import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, BookOpen } from 'lucide-react';
import Button from '../common/Button';
import AnalyticsView from './reproductive/Analytics/AnalyticsView';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'analytics' | 'resources';
  onTabChange: (tab: 'analytics' | 'resources') => void;
}

export default function SidePanel({ isOpen, onClose, activeTab, onTabChange }: SidePanelProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50"
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                ${activeTab === 'analytics' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <TrendingUp size={20} />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => onTabChange('resources')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                ${activeTab === 'resources' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <BookOpen size={20} />
              <span>Resources</span>
            </button>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X size={24} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'analytics' ? (
            <AnalyticsView />
          ) : (
            <ResourcesView />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ResourcesView() {
  const resources = [
    {
      title: "Understanding Your Cycle",
      description: "Learn about the four phases of your menstrual cycle",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=800"
    },
    {
      title: "Nutrition for Reproductive Health",
      description: "Essential nutrients for a healthy cycle",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary">Health Resources</h2>
      <div className="grid gap-6">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={resource.image}
              alt={resource.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{resource.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
              <p className="text-sm text-primary mt-2">{resource.readTime} read</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}