import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Custom Button component
const AnimatedButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`transform transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
  >
    {children}
  </button>
);

// Modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-200">
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

const PeriodCalendar = ({ cycles, predictions, onLogPeriod, selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalMonth, setModalMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedDates([]);
    }
  }, [isModalOpen]);

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

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

  const isSameDay = (date1: Date, date2: Date): boolean =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const toggleDateSelection = (date: Date) => {
    if (tempSelectedDates.some((d) => isSameDay(d, date))) {
      const newSelection = tempSelectedDates.filter((d) => !isSameDay(d, date));
      setTempSelectedDates(newSelection);
    } else {
      setTempSelectedDates([...tempSelectedDates, date]);
    }
  };

  const isCurrentMonth = (date: Date): boolean => date.getMonth() === currentMonth.getMonth();

  const getDateStatus = (date: Date): string => {
    if (tempSelectedDates.some((d) => isSameDay(d, date))) {
      return 'selected';
    }

    if (predictions && predictions.predictions) {
      const {
        predictedNextPeriodStart,
        predictedNextPeriodEnd,
        estimatedOvulationDate,
        fertileWindow,
      } = predictions.predictions;

      if (
        predictedNextPeriodStart &&
        predictedNextPeriodEnd &&
        date >= predictedNextPeriodStart &&
        date <= predictedNextPeriodEnd
      ) {
        return 'period';
      }

      if (
        fertileWindow &&
        date >= fertileWindow.start &&
        date <= fertileWindow.end
      ) {
        return 'fertile';
      }

      if (estimatedOvulationDate && isSameDay(date, estimatedOvulationDate)) {
        return 'ovulation';
      }
    }

    return 'safe';
  };

  const handleSavePeriod = () => {
    if (tempSelectedDates.length === 0) {
      alert('Please select at least one day for your period.');
      return;
    }
    const sortedDates = [...tempSelectedDates].sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    onLogPeriod(startDate, endDate);
    setIsModalOpen(false);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <>
      <div className="bg-teal-50 rounded-xl shadow-sm p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <AnimatedButton
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
            }
            className="p-2 hover:bg-teal-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-teal-600" />
          </AnimatedButton>
          <h2 className="text-xl font-semibold text-teal-600">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <AnimatedButton
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
            }
            className="p-2 hover:bg-teal-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5 text-teal-600" />
          </AnimatedButton>
        </div>

        {/* Weekdays Header */}
        <div className="grid grid-cols-7 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-teal-600">
              {day.charAt(0)}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const status = getDateStatus(day);
            const isCurrentMonthDay = isCurrentMonth(day);

            const statusClasses = {
              selected: 'bg-blue-100 text-blue-600',
              period: 'bg-pink-100 text-pink-600',
              fertile: 'bg-green-100 text-green-600',
              ovulation: 'bg-yellow-100 text-yellow-600',
              safe: 'hover:bg-teal-100 text-teal-600',
            };

            return (
              <AnimatedButton
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-full flex items-center justify-center text-sm ${
                  !isCurrentMonthDay && 'text-gray-300'
                } ${statusClasses[status]} ${isSelected ? 'ring-2 ring-teal-500' : ''} transition-all duration-200`}
              >
                <span>{day.getDate()}</span>
              </AnimatedButton>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6">
          <h3 className="text-teal-600 font-semibold mb-2">Legend</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-100 rounded-full"></div>
              <span className="text-sm">Period</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 rounded-full"></div>
              <span className="text-sm">Fertile Window</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 rounded-full"></div>
              <span className="text-sm">Ovulation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-100 rounded-full"></div>
              <span className="text-sm">Safe</span>
            </div>
          </div>
        </div>

        {/* Log Period Button */}
        <div className="mt-6 flex justify-center">
          <AnimatedButton
            onClick={() => {
              setModalMonth(currentMonth);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Log Period
          </AnimatedButton>
        </div>
      </div>

      {/* Log Period Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-teal-600">Select Period Days</h3>
          <div className="mb-4 flex items-center justify-between">
            <AnimatedButton
              onClick={() =>
                setModalMonth(
                  new Date(modalMonth.getFullYear(), modalMonth.getMonth() - 1)
                )
              }
              className="p-2 hover:bg-teal-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-teal-600" />
            </AnimatedButton>
            <h4 className="text-md font-semibold text-teal-600">
              {modalMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            <AnimatedButton
              onClick={() =>
                setModalMonth(
                  new Date(modalMonth.getFullYear(), modalMonth.getMonth() + 1)
                )
              }
              className="p-2 hover:bg-teal-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-teal-600" />
            </AnimatedButton>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-teal-600"
              >
                {day.charAt(0)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(modalMonth).map((day) => {
              const isSelected = tempSelectedDates.some((d) => isSameDay(d, day));
              const isCurrentMonthDay = day.getMonth() === modalMonth.getMonth();

              return (
                <AnimatedButton
                  key={day.toISOString()}
                  onClick={() => toggleDateSelection(day)}
                  className={`aspect-square rounded-lg flex items-center justify-center ${
                    !isCurrentMonthDay && 'text-gray-300'
                  } ${
                    isSelected
                      ? 'bg-pink-100 border border-gray-600'
                      : 'hover:bg-teal-100 text-teal-600'
                  } transition-all duration-200`}
                >
                  <span>{day.getDate()}</span>
                </AnimatedButton>
              );
            })}
          </div>

          {/* Modal Actions */}
          <div className="mt-4 flex justify-end space-x-2">
            <AnimatedButton
              onClick={() => {
                setIsModalOpen(false);
                setTempSelectedDates([]);
              }}
              className="px-4 py-2 border border-teal-300 rounded-lg hover:bg-teal-100 text-teal-600"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleSavePeriod}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
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

