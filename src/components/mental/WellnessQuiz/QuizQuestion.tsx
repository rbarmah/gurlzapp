import React from 'react';
import { motion } from 'framer-motion';

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  category: string;
}

export default function QuizQuestion({
  question,
  options,
  selectedAnswer,
  onAnswer,
  category
}: QuizQuestionProps) {
  return (
    <div className="space-y-6" role="group" aria-labelledby="question-title">
      {/* Category Display */}
      <div className="bg-primary/5 px-4 py-2 rounded-lg">
        <span className="text-sm font-medium text-primary">{category}</span>
      </div>

      {/* Question */}
      <h3 id="question-title" className="text-xl font-semibold text-gray-900">
        {question}
      </h3>

      {/* Options */}
      {options.length > 0 ? (
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(option)}
              aria-pressed={selectedAnswer === option}
              className={`w-full p-4 text-left rounded-xl transition-colors
                ${selectedAnswer === option
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No options available for this question.</p>
      )}
    </div>
  );
}
