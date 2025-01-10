import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PeriodCalendarProps {
  selectedDate: Date;
  periodDays: Date[];
  onSelectDate: (date: Date) => void;
}

export default function PeriodCalendar({ selectedDate, periodDays, onSelectDate }: PeriodCalendarProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isPeriodDay = (date: Date) => 
    periodDays.some(periodDay => isSameDay(periodDay, date));

  const isCurrentMonth = (date: Date) =>
    date.getMonth() === selectedDate.getMonth();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-primary">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Prediction Info */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500">Your next period will start on the</p>
        <p className="text-2xl font-bold text-primary mt-1">
          18th of this month
        </p>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day, index) => (
          <div 
            key={`header-${index}`}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const isPeriod = isPeriodDay(day);
          const isCurrentMonthDay = isCurrentMonth(day);

          return (
            <motion.button
              key={`day-${index}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(day)}
              className={`
                aspect-square rounded-full flex items-center justify-center text-sm
                ${!isCurrentMonthDay && 'text-gray-300'}
                ${isPeriod ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}
                ${isSelected ? 'ring-2 ring-primary' : ''}
                transition-all duration-200
              `}
            >
              {format(day, 'd')}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 mr-2" />
          <span className="text-gray-600">Period Days</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary mr-2" />
          <span className="text-gray-600">Selected Day</span>
        </div>
      </div>
    </div>
  );
}