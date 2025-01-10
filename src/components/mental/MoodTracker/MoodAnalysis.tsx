import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { MoodEntry } from '../../../types/mental';

interface MoodAnalysisProps {
  entries: MoodEntry[];
}

export default function MoodAnalysis({ entries }: MoodAnalysisProps) {
  // Simple mood analysis logic
  const recentMoods = entries.slice(-5);
  const moodCounts = recentMoods.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  const insights = {
    happy: {
      title: "Keep up the positive momentum!",
      tips: [
        "Share your joy with others",
        "Document what's working well",
        "Build on this positive energy"
      ]
    },
    neutral: {
      title: "Maintaining steady balance",
      tips: [
        "Try new activities to boost mood",
        "Practice mindfulness",
        "Connect with friends"
      ]
    },
    sad: {
      title: "Let's work on lifting your spirits",
      tips: [
        "Talk to someone you trust",
        "Practice self-care activities",
        "Consider professional support"
      ]
    }
  };

  const currentInsight = insights[dominantMood as keyof typeof insights] || insights.neutral;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{currentInsight.title}</h4>
              <p className="text-sm text-gray-500 mt-1">
                Based on your recent mood patterns
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Recommended Actions:</h5>
            <ul className="space-y-2">
              {currentInsight.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 text-gray-600"
                >
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}