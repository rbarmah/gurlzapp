import { addDays, differenceInDays } from 'date-fns';
import { CycleData, BBTLog, CervicalMucusLog, LifestyleFactors, PredictionResult } from './types';
import { calculateAverageCycle } from './calculations';

export class PeriodTracker {
  private cycles: CycleData[] = [];
  private bbtLogs: BBTLog[] = [];
  private mucusLogs: CervicalMucusLog[] = [];
  private lifestyleFactors?: LifestyleFactors;

  predictNextPeriod(): PredictionResult | null {
    // If we don't have enough cycles, return a basic prediction
    if (this.cycles.length < 3) {
      if (this.cycles.length === 0) {
        return null;
      }

      // Use last cycle and default values for basic prediction
      const lastCycle = this.cycles[this.cycles.length - 1];
      const defaultCycleLength = 28;
      const nextPeriodDate = addDays(new Date(lastCycle.startDate), defaultCycleLength);
      const ovulationDate = addDays(nextPeriodDate, -14);
      
      return {
        nextPeriodDate,
        fertileWindow: {
          start: addDays(ovulationDate, -5),
          end: addDays(ovulationDate, 1)
        },
        ovulationDate,
        confidence: 0.5 // Lower confidence for basic prediction
      };
    }

    // Regular prediction logic for 3+ cycles
    const recentCycles = this.cycles.slice(-3);
    const { cycleLength } = calculateAverageCycle(recentCycles);
    
    const lastPeriod = this.cycles[this.cycles.length - 1];
    const nextPeriodDate = addDays(new Date(lastPeriod.startDate), cycleLength);
    const ovulationDate = addDays(nextPeriodDate, -14);
    
    const fertileWindow = {
      start: addDays(ovulationDate, -5),
      end: addDays(ovulationDate, 1)
    };

    // Calculate confidence based on cycle regularity
    const cycleLengths = this.cycles.slice(-3).map(cycle => 
      differenceInDays(new Date(cycle.endDate), new Date(cycle.startDate))
    );
    const avgLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
    const variance = cycleLengths.reduce((acc, len) => 
      acc + Math.pow(len - avgLength, 2), 0
    ) / cycleLengths.length;
    
    const confidence = Math.max(0.5, Math.min(1, 1 - (variance / 100)));

    return {
      nextPeriodDate,
      fertileWindow,
      ovulationDate,
      confidence
    };
  }

  // Rest of the class implementation...
}