import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, BookOpen } from 'lucide-react';
import Button from '../common/Button';
import AnalyticsView from './reproductive/Analytics/AnalyticsView';
import ResourcesView from '../health/ResourcesView';

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
      className="fixed inset-y-0 right-0 w-screen bg-white shadow-xl z-50"
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