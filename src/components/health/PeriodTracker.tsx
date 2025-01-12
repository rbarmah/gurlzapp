import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Droplets, X } from 'lucide-react';
import { CycleData } from '../../types/health';
import { PredictionResult } from '../../utils/periodTracking';

interface PeriodTrackerProps {
  selectedDate: Date;
  cycles: CycleData[];
  predictions: PredictionResult | null;
}

export default function PeriodTracker({ selectedDate, cycles, predictions }: PeriodTrackerProps) {
  const getNextPeriod = () => {
    if (!predictions || !predictions.predictions) return null;
    return predictions.predictions.predictedNextPeriodStart;
  };

  const nextPeriod = getNextPeriod();
  const daysUntilNext = nextPeriod
    ? differenceInDays(nextPeriod, new Date())
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <Calendar className="w-6 h-6 text-primary" />
        <h2 className="text-lg font-semibold text-primary">Period Tracker</h2>
      </div>

      {cycles.length > 0 ? (
        <>
          <div className="bg-primary/10 p-4 rounded-xl">
            <h3 className="font-medium text-primary mb-2">Next Period</h3>
            {nextPeriod && (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {format(nextPeriod, 'MMMM d')}
                </p>
                <p className="text-sm text-gray-600">
                  {daysUntilNext === 0 ? 'Starting today' :
                    daysUntilNext === 1 ? 'Starting tomorrow' :
                      daysUntilNext && daysUntilNext > 0 ? `In ${daysUntilNext} days` :
                        'Calculating...'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <h3 className="font-medium text-green-600 mb-2">Fertile Window</h3>
            {predictions && predictions.predictions && predictions.predictions.fertileWindow && (
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  {format(predictions.predictions.fertileWindow.start, 'MMMM d')} - {format(predictions.predictions.fertileWindow.end, 'MMMM d')}
                </p>
                <p className="text-xs text-gray-500">Plan accordingly!</p>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl">
            <h3 className="font-medium text-yellow-600 mb-2">Ovulation Date</h3>
            {predictions && predictions.predictions && predictions.predictions.estimatedOvulationDate && (
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  {format(predictions.predictions.estimatedOvulationDate, 'MMMM d')}
                </p>
                <p className="text-xs text-gray-500">Peak fertility!</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Recent Cycles</h3>
            {cycles.slice(-3).reverse().map((cycle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group"
              >
                <div className='flex justify-between w-full'>
                  <div className='flex items-center gap-x-2'>
                    <Droplets className="w-5 h-5 text-red-400" />
                    <div className='flex flex-col'>
                      <p className="text-sm font-medium text-gray-700">
                        {format(new Date(cycle.startDate), 'MMM d')} - {format(new Date(cycle.endDate), 'MMM d')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {differenceInDays(new Date(cycle.endDate), new Date(cycle.startDate)) + 1} days
                      </p>
                    </div>
                  </div>
                  <div>
                    <X className='hidden group-hover:block w-5 h-5 text-gray-500 cursor-pointer' />
                  </div>
                </div>
              </motion.div>

            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No cycles tracked yet</p>
          <p className="text-sm mt-2">Start by logging your period on the calendar</p>
        </div>
      )}
    </div>
  );
}
