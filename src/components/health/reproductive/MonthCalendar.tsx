import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import DateDetailModal from './DateDetailModal';

interface MonthCalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  periodDays: Date[];
  ovulationDate?: Date;
  fertileWindow?: { start: Date; end: Date };
  onLogPeriod: (date: Date, type: 'start' | 'end') => void;
  prediction: any;
}

export default function MonthCalendar({
  currentDate,
  selectedDate,
  onDateSelect,
  periodDays,
  ovulationDate,
  fertileWindow,
  onLogPeriod,
  prediction
}: MonthCalendarProps) {
  const [showModal, setShowModal] = React.useState(false);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    setShowModal(true);
  };

  const handleLogPeriod = (type: 'start' | 'end') => {
    if (selectedDate) {
      onLogPeriod(selectedDate, type);
      setShowModal(false);
    }
  };

  const getDayColor = (date: Date) => {
    if (selectedDate && isSameDay(date, selectedDate)) {
      return 'bg-primary text-white ring-2 ring-primary';
    }
    if (periodDays.some(d => isSameDay(d, date))) {
      return 'bg-red-100 text-red-600 hover:bg-red-200';
    }
    if (ovulationDate && isSameDay(date, ovulationDate)) {
      return 'bg-green-100 text-green-600 hover:bg-green-200';
    }
    if (fertileWindow && date >= fertileWindow.start && date <= fertileWindow.end) {
      return 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200';
    }
    return 'hover:bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary text-center">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDateClick(day)}
            className={`
              aspect-square rounded-full flex items-center justify-center text-sm
              transition-all duration-200 ${getDayColor(day)}
              ${!isSameMonth(day, currentDate) && 'text-gray-300'}
            `}
          >
            {format(day, 'd')}
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 mr-1" />
          <span>Period</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-100 mr-1" />
          <span>Fertile</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 mr-1" />
          <span>Ovulation</span>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedDate && (
          <DateDetailModal
            date={selectedDate}
            onClose={() => setShowModal(false)}
            onLogPeriod={handleLogPeriod}
            prediction={prediction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}