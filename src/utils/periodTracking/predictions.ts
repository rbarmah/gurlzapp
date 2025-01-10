import { addDays } from 'date-fns';
import { CycleData, PredictionResult } from './types';

export function predictNextPeriod(
  lastCycle: CycleData,
  averageCycle: { cycleLength: number; periodLength: number }
): PredictionResult {
  const nextPeriodDate = addDays(lastCycle.startDate, averageCycle.cycleLength);
  const ovulationDate = addDays(nextPeriodDate, -14);
  
  const fertileWindow = {
    start: addDays(ovulationDate, -5),
    end: addDays(ovulationDate, 1)
  };

  // Calculate phase and confidence
  const phase = calculateCurrentPhase(lastCycle, averageCycle);
  const confidence = calculatePredictionConfidence(lastCycle, averageCycle);

  return {
    nextPeriodDate,
    fertileWindow,
    ovulationDate,
    confidence,
    phase
  };
}

function calculateCurrentPhase(
  lastCycle: CycleData,
  averageCycle: { cycleLength: number; periodLength: number }
): string {
  // Phase calculation logic here
  return 'follicular'; // Placeholder
}

function calculatePredictionConfidence(
  lastCycle: CycleData,
  averageCycle: { cycleLength: number; periodLength: number }
): number {
  // Confidence calculation logic here
  return 0.85; // Placeholder
}