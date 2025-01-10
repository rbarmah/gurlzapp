import React, { useRef, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';

interface ScrollableCalendarProps {
  selectedDate: Date;
  periodDays: Date[];
  ovulationDate: Date;
  fertileWindow: { start: Date; end: Date };
  onDateSelect: (date: Date) => void;
}

export default function ScrollableCalendar({
  selectedDate,
  periodDays,
  ovulationDate,
  fertileWindow,
  onDateSelect
}: ScrollableCalendarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const days = Array.from({ length: 60 }, (_, i) => addDays(new Date(), i - 30));

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

  const getDayColor = (date: Date) => {
    if (periodDays.some(d => isSameDay(d, date))) {
      return 'bg-red-100 text-red-600';
    }
    if (isSameDay(date, ovulationDate)) {
      return 'bg-green-100 text-green-600';
    }
    if (date >= fertileWindow.start && date <= fertileWindow.end) {
      return 'bg-blue-100 text-blue-600';
    }
    return 'hover:bg-gray-100';
  };

  return (
    <div 
      ref={scrollRef}
      className="overflow-x-auto hide-scrollbar"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="flex space-x-2 p-4">
        {days.map((date, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDateSelect(date)}
            className={`
              flex-none w-16 py-3 rounded-xl text-center transition-colors
              ${getDayColor(date)}
              ${isSameDay(date, selectedDate) ? 'ring-2 ring-primary' : ''}
            `}
          >
            <div className="text-xs text-gray-500">{format(date, 'EEE')}</div>
            <div className="text-lg font-semibold">{format(date, 'd')}</div>
            <div className="text-xs text-gray-500">{format(date, 'MMM')}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}