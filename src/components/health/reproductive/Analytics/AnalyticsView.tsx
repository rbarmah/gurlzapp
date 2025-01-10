import React from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '../../../../store/healthStore';
import CycleLengthChart from './CycleLengthChart';
import FlowIntensityChart from './FlowIntensityChart';
import SymptomCorrelationChart from './SymptomCorrelationChart';
import PredictionAccuracyChart from './PredictionAccuracyChart';

export default function AnalyticsView() {
  const { cycles, getAnalytics } = useHealthStore();
  const analytics = getAnalytics();

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6"
        >
          <h4 className="text-sm text-gray-500 mb-1">Average Cycle Length</h4>
          <p className="text-2xl font-bold text-primary">
            {Math.round(analytics.avgCycleLength)} days
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6"
        >
          <h4 className="text-sm text-gray-500 mb-1">Average Period Length</h4>
          <p className="text-2xl font-bold text-primary">
            {Math.round(analytics.avgPeriodLength)} days
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6"
        >
          <h4 className="text-sm text-gray-500 mb-1">Cycle Regularity</h4>
          <p className="text-2xl font-bold text-primary">
            {Math.round(analytics.regularityScore)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6"
        >
          <h4 className="text-sm text-gray-500 mb-1">Tracked Cycles</h4>
          <p className="text-2xl font-bold text-primary">{cycles.length}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CycleLengthChart cycles={cycles} />
        <FlowIntensityChart cycles={cycles} />
        <SymptomCorrelationChart cycles={cycles} />
        <PredictionAccuracyChart cycles={cycles} />
      </div>
    </div>
  );
}