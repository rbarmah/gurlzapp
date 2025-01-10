import { useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import { useHealthStore } from '../../../../store/healthStore';

export function usePeriodTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { cycles, addCycle, getPrediction } = useHealthStore();

  const prediction = cycles.length >= 3 ? getPrediction() : null;
  const nextPeriodDate = prediction?.nextPeriodDate || addDays(new Date(), 14);
  const fertileWindow = prediction?.fertileWindow || {
    start: addDays(new Date(), 7),
    end: addDays(new Date(), 12)
  };

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleAddPeriod = useCallback((startDate: Date, endDate: Date) => {
    addCycle({
      startDate,
      endDate,
      periodLength: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      symptoms: []
    });
  }, [addCycle]);

  return {
    selectedDate,
    nextPeriodDate,
    fertileWindow,
    prediction,
    handleDateSelect,
    handleAddPeriod
  };
}