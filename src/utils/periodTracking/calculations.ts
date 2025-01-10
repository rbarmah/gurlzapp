import { differenceInDays } from 'date-fns';
import { CycleData } from './types';

export function calculateAverageCycle(cycles: CycleData[]) {
  const recentCycles = cycles.slice(-3);
  const weights = [0.5, 0.3, 0.2]; // More recent cycles have higher weight

  const averageLength = Math.round(
    recentCycles.reduce((acc, cycle, i) => 
      acc + cycle.length * weights[i], 0
    )
  );

  const averagePeriodLength = Math.round(
    recentCycles.reduce((acc, cycle) => 
      acc + differenceInDays(cycle.endDate, cycle.startDate) + 1, 0
    ) / recentCycles.length
  );

  return {
    cycleLength: averageLength,
    periodLength: averagePeriodLength
  };
}