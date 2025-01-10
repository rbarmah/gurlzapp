import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../common/Button';
import DateDetailModal from './DateDetailModal';
import SymptomsModal from './SymptomsModal';

interface PeriodCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  prediction: any;
  onLogPeriod: (date: Date, type: 'start' | 'end') => void;
  periodDays: Date[];
}

export default function PeriodCalendar({
  selectedDate,
  onDateSelect,
  prediction,
  onLogPeriod,
  periodDays
}: PeriodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [showDateModal, setShowDateModal] = useState(false);
  const [showSymptomsModal, setShowSymptomsModal] = useState(false);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayColor = (date: Date) => {
    // Period days (red)
    if (periodDays.some(d => isSameDay(d, date))) {
      return 'bg-red-100 text-red-600 hover:bg-red-200';
    }

    if (prediction) {
      // Ovulation day (deep green)
      if (isSameDay(date, prediction.ovulationDate)) {
        return 'bg-green-600 text-white hover:bg-green-700';
      }

      // Fertile window (light pink)
      if (isWithinInterval(date, prediction.fertileWindow)) {
        return 'bg-pink-50 text-pink-600 hover:bg-pink-100';
      }

      // Safe days (light green)
      return 'bg-green-50 text-green-600 hover:bg-green-100';
    }

    return 'hover:bg-gray-100';
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    setShowDateModal(true);
  };

  const handleLogPeriod = (type: 'start' | 'end') => {
    onLogPeriod(selectedDate, type);
    setShowDateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentMonth(prev => startOfMonth(new Date(prev.getFullYear(), prev.getMonth() - 1)))}
        >
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button
          variant="outline"
          onClick={() => setCurrentMonth(prev => startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + 1)))}
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                transition-colors ${getDayColor(day)}
                ${isSameDay(day, selectedDate) ? 'ring-2 ring-primary' : ''}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">{format(day, 'd')}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 mr-2" />
          <span>Period</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-600 mr-2" />
          <span>Ovulation</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-pink-50 mr-2" />
          <span>Fertile</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-50 mr-2" />
          <span>Safe</span>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDateModal && (
          <DateDetailModal
            date={selectedDate}
            prediction={prediction}
            onClose={() => setShowDateModal(false)}
            onLogPeriod={handleLogPeriod}
            onLogSymptoms={() => {
              setShowDateModal(false);
              setShowSymptomsModal(true);
            }}
          />
        )}

        {showSymptomsModal && (
          <SymptomsModal
            onClose={() => setShowSymptomsModal(false)}
            onSubmit={(data) => {
              console.log('Symptoms data:', data);
              setShowSymptomsModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}