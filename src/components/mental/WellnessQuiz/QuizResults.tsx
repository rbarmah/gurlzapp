import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Sun, Users, Coffee, Moon } from 'lucide-react';
import Button from '../../common/Button';

interface CategoryScore {
  category: string;
  score: number;
  recommendations: string[];
}

interface QuizResultsProps {
  scores: CategoryScore[];
  onRetake: () => void;
  onSave: () => void;
}

const categoryIcons = {
  'Emotional Well-being': Heart,
  'Stress Management': Brain,
  'Social Connection': Users,
  'Self-care': Coffee,
  'Sleep Quality': Moon,
  'Life Satisfaction': Sun
};

export default function QuizResults({ scores, onRetake, onSave }: QuizResultsProps) {
  const overallScore = Math.round(
    scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Overall Score */}
      <div className="text-center">
        <div className="inline-block p-8 rounded-full bg-primary/10">
          <div className="text-4xl font-bold text-primary">{overallScore}%</div>
          <div className="text-sm text-gray-600">Overall Well-being</div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scores.map((score, index) => {
          const Icon = categoryIcons[score.category as keyof typeof categoryIcons] || Brain;
          
          return (
            <motion.div
              key={score.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{score.category}</h3>
                  <p className="text-sm text-gray-500">{score.score}% Score</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${score.score}%` }}
                  />
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Recommendations:</h4>
                  <ul className="space-y-2">
                    {score.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onRetake}>
          Retake Quiz
        </Button>
        <Button onClick={onSave}>
          Save Results
        </Button>
      </div>
    </motion.div>
  );
}