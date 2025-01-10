import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BarChart3 } from 'lucide-react';

interface InsightsSectionProps {
  cycles: Array<{
    startDate: Date;
    endDate: Date;
    length: number;
  }>;
}

export default function InsightsSection({ cycles }: InsightsSectionProps) {
  const lastFiveCycles = cycles.slice(-5).reverse();
  const maxLength = Math.max(...lastFiveCycles.map(c => c.length));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-primary">Cycle Insights</h2>
      </div>

      <div className="space-y-4">
        {lastFiveCycles.map((cycle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {format(cycle.startDate, 'MMMM yyyy')}
              </span>
              <span className="font-medium">{cycle.length} days</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(cycle.length / maxLength) * 100}%` }}
                className="h-full bg-primary"
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <h3 className="font-medium text-primary mb-2">Summary</h3>
        <p className="text-sm text-gray-600">
          Average cycle length: {Math.round(
            lastFiveCycles.reduce((acc, curr) => acc + curr.length, 0) / lastFiveCycles.length
          )} days
        </p>
      </div>
    </div>
  );
}