import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { useHealthStore } from '../../../store/healthStore';
import PeriodCalendar from './PeriodCalendar';
import PeriodCountdownBanner from './PeriodCountdownBanner';
import SymptomTracker from './SymptomTracker';
import DailyInsights from './DailyInsights';
import { PredictionData } from '../../../types/health';
import Button from '../../common/Button';

interface PeriodTrackerDashboardProps {
  prediction: PredictionData | null;
}

export default function PeriodTrackerDashboard({ prediction }: PeriodTrackerDashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { cycles, logPeriodStart, logPeriodEnd } = useHealthStore();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleLogPeriod = (date: Date, type: 'start' | 'end') => {
    try {
      if (type === 'start') {
        logPeriodStart(date);
      } else {
        logPeriodEnd(date);
      }
    } catch (error) {
      console.log('Period logging will improve with more data');
    }
  };

  return (
    <div className="space-y-6">
      {cycles.length < 3 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-700">
            Track at least 3 cycles for more accurate predictions. You've tracked {cycles.length} {cycles.length === 1 ? 'cycle' : 'cycles'} so far.
          </p>
        </div>
      ) : prediction && (
        <PeriodCountdownBanner 
          nextPeriodDate={prediction.nextPeriodDate}
          confidence={prediction.confidence}
        />
      )}

      {/* Rest of the component... */}
    </div>
  );
}