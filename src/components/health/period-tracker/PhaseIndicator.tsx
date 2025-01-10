import React from 'react';
import { motion } from 'framer-motion';

interface PhaseIndicatorProps {
  currentPhase: number;
  totalPhases: number;
}

export default function PhaseIndicator({ currentPhase, totalPhases }: PhaseIndicatorProps) {
  return (
    <div className="px-6 py-4 bg-primary/5">
      <div className="flex justify-between">
        {Array.from({ length: totalPhases }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center
              ${index + 1 === currentPhase 
                ? 'bg-primary text-white' 
                : 'bg-white text-primary border-2 border-primary/20'}`}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.div>
        ))}
      </div>
    </div>
  );
}