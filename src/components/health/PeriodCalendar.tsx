import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import { CycleData } from '../../types/health';

interface PeriodCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  cycles: CycleData[];
  onLogPeriod: (date: Date, type: 'start' | 'end') => void;
}

export default function PeriodCalendar({
  selectedDate,
  onDateSelect,
  cycles,
  onLogPeriod
}: PeriodCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(selectedDate));
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const isPeriodDay = (date: Date) => {
    return cycles.some(cycle => {
      const cycleStart = new Date(cycle.startDate);
      const cycleEnd = new Date(cycle.endDate);
      return date >= cycleStart && date <= cycleEnd;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
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
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isPeriod = isPeriodDay(day);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          return (
            <motion.button
              key={idx}
              onClick={() => onDateSelect(day)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                transition-colors relative
                ${!isCurrentMonth && 'text-gray-300'}
                ${isPeriod ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}
                ${isSelected ? 'ring-2 ring-primary' : ''}
              `}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {isPeriod && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center space-x-4">
        <Button onClick={() => onLogPeriod(selectedDate, 'start')}>
          Log Period Start
        </Button>
        <Button onClick={() => onLogPeriod(selectedDate, 'end')}>
          Log Period End
        </Button>
      </div>
    </div>
  );
}