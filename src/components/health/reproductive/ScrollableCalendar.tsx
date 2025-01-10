import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { DayInfo } from '../../../types/health';

interface ScrollableCalendarProps {
  days: DayInfo[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function ScrollableCalendar({ days, selectedDate, onDateSelect }: ScrollableCalendarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        element.scrollLeft += e.deltaY;
      };
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => element.removeEventListener('wheel', handleWheel);
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-primary mb-6">Your Cycle Calendar</h3>
      <div 
        ref={scrollRef}
        className="overflow-x-auto hide-scrollbar"
      >
        <div className="flex space-x-2 min-w-max pb-4">
          {days.map((day, index) => (
            <motion.button
              key={index}
              onClick={() => onDateSelect(day.date)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300
                ${day.isSelected ? 'transform scale-110 shadow-lg' : ''}
              `}
            >
              <span className="text-sm text-gray-500">
                {format(day.date, 'EEE')}
              </span>
              <div className={`relative w-12 h-12 flex items-center justify-center rounded-full my-1
                ${day.isSelected ? 'bg-primary text-white' : 
                  day.actualPeriod ? 'bg-primary text-white' : 'bg-secondary/10 text-gray-700'}
              `}>
                <span className="text-lg">
                  {format(day.date, 'd')}
                </span>
                {day.actualPeriod && (
                  <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-xs text-gray-500">
                {format(day.date, 'MMM')}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}