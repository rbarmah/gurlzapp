import React from 'react';
import { motion } from 'framer-motion';
import { differenceInDays } from 'date-fns';

interface PeriodCountdownBannerProps {
  nextPeriodDate: Date;
}

export default function PeriodCountdownBanner({ nextPeriodDate }: PeriodCountdownBannerProps) {
  const daysUntilPeriod = differenceInDays(nextPeriodDate, new Date());
  
  const getMessage = () => {
    if (daysUntilPeriod === 0) return "Your period starts today!";
    if (daysUntilPeriod === 1) return "Your period starts tomorrow!";
    return `Your period starts in ${daysUntilPeriod} days`;
  };

  const getEmoji = () => {
    if (daysUntilPeriod <= 2) return "🌸";
    if (daysUntilPeriod <= 5) return "📅";
    return "✨";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.h2 
            className="text-2xl font-bold text-primary mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {getMessage()}
          </motion.h2>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Stay prepared and track your symptoms
          </motion.p>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.4 
          }}
          className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg"
        >
          <span className="text-3xl">{getEmoji()}</span>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((28 - daysUntilPeriod) / 28) * 100}%` }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
}