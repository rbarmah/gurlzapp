import { useState, useCallback } from 'react';
import { addDays, differenceInDays } from 'date-fns';
import { useHealthStore } from '../store/healthStore';
import { PredictionDetails } from '../types/health';

export function usePeriodTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  const handleAddPeriod = useCallback((startDate: Date, isStart: boolean) => {
    if (isStart) {
      // Find any existing cycle that might need to be updated
      const existingCycle = cycles.find(cycle => 
        differenceInDays(startDate, cycle.startDate) < 7
      );

      if (existingCycle) {
        // Update existing cycle
        addCycle({
          ...existingCycle,
          startDate: startDate
        });
      } else {
        // Create new cycle
        addCycle({
          id: Date.now().toString(),
          startDate,
          endDate: addDays(startDate, 5), // Default period length
          length: 28, // Default cycle length
          periodLength: 5,
          symptoms: []
        });
      }
    }
  }, [cycles, addCycle]);

  const getMLPrediction = useCallback((date: Date): PredictionDetails => {
    // Calculate prediction based on historical data
    const daysToPeriod = prediction ? 
      differenceInDays(prediction.nextPeriodDate, date) : 14;
    
    let predictionType: 'period' | 'ovulation' | 'fertile' | 'safe' = 'safe';
    let probability = 0.8;
    let details = '';
    let recommendations: string[] = [];

    if (daysToPeriod <= 5 && daysToPeriod >= 0) {
      predictionType = 'period';
      probability = 0.95;
      details = "High likelihood of period starting";
      recommendations = [
        "Keep period supplies handy",
        "Stay hydrated",
        "Consider taking pain relief medication if needed"
      ];
    } else if (daysToPeriod >= 12 && daysToPeriod <= 16) {
      predictionType = 'fertile';
      probability = 0.85;
      details = "You're in your fertile window";
      recommendations = [
        "Track any ovulation symptoms",
        "Monitor body temperature",
        "Note any changes in discharge"
      ];
    } else if (daysToPeriod === 14) {
      predictionType = 'ovulation';
      probability = 0.9;
      details = "Ovulation likely today";
      recommendations = [
        "You may experience mild cramping",
        "Track your basal body temperature",
        "Note any changes in cervical mucus"
      ];
    }

    return {
      type: predictionType,
      probability,
      details,
      recommendations
    };
  }, [prediction]);

  return {
    selectedDate,
    nextPeriodDate,
    fertileWindow,
    prediction,
    handleDateSelect,
    handleAddPeriod,
    getMLPrediction
  };
}