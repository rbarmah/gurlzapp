import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

// Custom Button component with animations
const AnimatedButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`transform transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
  >
    {children}
  </button>
);

// Modal component with animation
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-200"
      >
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transform transition-all duration-200 hover:scale-110"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const PeriodCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalMonth, setModalMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [tempSelectedDates, setTempSelectedDates] = useState([]);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedDates([...selectedDates]);
    }
  }, [isModalOpen]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const isSameDay = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const toggleDateSelection = (date) => {
    if (tempSelectedDates.length === 0) {
      // Auto-select 6 days on first selection
      const dates = [];
      for (let i = 0; i < 6; i++) {
        dates.push(addDays(date, i));
      }
      setTempSelectedDates(dates);
    } else {
      // Toggle individual dates
      if (tempSelectedDates.some(d => isSameDay(d, date))) {
        const newSelection = tempSelectedDates.filter(d => !isSameDay(d, date));
        setTempSelectedDates(newSelection);
      } else {
        setTempSelectedDates([...tempSelectedDates, date]);
      }
    }
  };

  const isCurrentMonth = (date) => 
    date.getMonth() === currentMonth.getMonth();

  const getDateStatus = (date) => {
    if (selectedDates.some(d => isSameDay(d, date))) {
      return 'period';
    }
    return 'safe';
  };

  const handleSavePeriod = () => {
    setSelectedDates([...tempSelectedDates]);
    setIsModalOpen(false);
  };

  const days = getDaysInMonth(currentMonth);
  const modalDays = getDaysInMonth(modalMonth);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <AnimatedButton 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </AnimatedButton>
          <h2 className="text-xl font-semibold text-primary">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <AnimatedButton 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </AnimatedButton>
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
            const status = getDateStatus(day);
            const isCurrentMonthDay = isCurrentMonth(day);

            return (
              <AnimatedButton
                key={`day-${index}`}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square rounded-full flex items-center justify-center text-sm
                  ${!isCurrentMonthDay && 'text-gray-300'}
                  ${status === 'period' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}
                  ${isSelected ? 'ring-2 ring-primary' : ''}
                  transition-all duration-200
                `}
              >
                <span>{day.getDate()}</span>
                {status === 'period' && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
              </AnimatedButton>
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

        {/* Log Period Button */}
        <div className="mt-6 flex justify-center">
          <AnimatedButton
            onClick={() => {
              setModalMonth(currentMonth);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Log Period
          </AnimatedButton>
        </div>
      </div>

      {/* Log Period Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Select Period Days</h3>
          
          {/* Modal Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <AnimatedButton
              onClick={() => setModalMonth(new Date(modalMonth.getFullYear(), modalMonth.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </AnimatedButton>
            <h2 className="text-lg font-semibold text-primary">
              {modalMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <AnimatedButton
              onClick={() => setModalMonth(new Date(modalMonth.getFullYear(), modalMonth.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </AnimatedButton>
          </div>

          {/* Modal Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {modalDays.map((day, idx) => {
              const isSelected = tempSelectedDates.some(d => isSameDay(d, day));
              const isCurrentMonth = day.getMonth() === modalMonth.getMonth();

              return (
                <AnimatedButton
                  key={idx}
                  onClick={() => toggleDateSelection(day)}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center relative
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                    hover:bg-gray-50
                    ${isSelected ? 'bg-blue-50' : ''}
                    transition-all duration-200
                  `}
                >
                  <span className="text-xs">{day.getDate()}</span>
                  <div className={`
                    absolute top-1 right-1 w-4 h-4 rounded-full border-2
                    transition-all duration-200
                    ${isSelected ? 'bg-primary border-primary flex items-center justify-center' : 'border-gray-300'}
                  `}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </AnimatedButton>
              );
            })}
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end space-x-2">
            <AnimatedButton
              onClick={() => {
                setIsModalOpen(false);
                setTempSelectedDates([...selectedDates]);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleSavePeriod}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Save
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PeriodCalendar;