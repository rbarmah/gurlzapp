import React from 'react';
import { format } from 'date-fns';
import { Calendar, Flower2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PhaseIndicator from './PhaseIndicator';
import CurrentPhaseCard from './CurrentPhaseCard';
import NextPeriodCard from './NextPeriodCard';
import { PredictionData } from '../../../types/health';

interface PeriodTrackerDashboardProps {
  nextPeriodDate: Date;
  prediction: PredictionData | null;
  onAddPeriod: (startDate: Date, endDate: Date) => void;
  onCalendarClick: () => void;
}

export default function PeriodTrackerDashboard({
  nextPeriodDate,
  prediction,
  onAddPeriod,
  onCalendarClick
}: PeriodTrackerDashboardProps) {
  const currentDate = new Date();
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              {format(currentDate, 'EEEE')}
            </h2>
            <p className="text-gray-500">
              {format(currentDate, 'MMMM do, yyyy')}
            </p>
          </div>
          <button 
            onClick={onCalendarClick}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Calendar className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      {/* Phase Indicator */}
      <PhaseIndicator currentPhase={4} totalPhases={9} />

      {/* Cards */}
      <div className="p-6 space-y-4">
        <CurrentPhaseCard 
          phase={prediction?.phase || 'Loading...'}
          date={currentDate}
        />
        <NextPeriodCard 
          startDate={nextPeriodDate}
          confidence={prediction?.confidence || 0}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center p-4 border-t border-gray-100">
        <button 
          onClick={onCalendarClick}
          className="p-2 text-primary hover:bg-primary/5 rounded-full"
        >
          <Calendar className="w-6 h-6" />
        </button>
        <button className="p-2 text-primary hover:bg-primary/5 rounded-full">
          <Flower2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}