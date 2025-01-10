import React from 'react';
import { motion } from 'framer-motion';
import { PredictionDetails } from '../../../types/health';

interface PredictionSphereProps {
  prediction: PredictionDetails;
}

export default function PredictionSphere({ prediction }: PredictionSphereProps) {
  const getTypeColor = () => {
    switch (prediction.type) {
      case 'period': return 'from-primary to-primary-dark';
      case 'ovulation': return 'from-green-400 to-green-600';
      case 'fertile': return 'from-yellow-400 to-yellow-600';
      default: return 'from-secondary to-secondary-dark';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative w-64 h-64 mx-auto perspective-1000"
    >
      {/* 3D Sphere Effect */}
      <motion.div
        animate={{ 
          rotateY: [0, 360],
          rotateX: [0, 360]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`
          absolute inset-0 rounded-full
          bg-gradient-to-br ${getTypeColor()}
          shadow-xl
          transform-gpu
          animate-float
        `}
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm" />
        
        {/* Highlight effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/30" />
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-xl mb-3"
        >
          {prediction.details}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg opacity-90"
        >
          {Math.round(prediction.probability * 100)}% confidence
        </motion.div>
      </div>
    </motion.div>
  );
}