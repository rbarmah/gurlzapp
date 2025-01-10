import { differenceInDays, addDays } from 'date-fns';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export function calculatePhase(
  currentDate: Date,
  lastPeriodStart: Date,
  cycleLength: number = 28
): {
  phase: CyclePhase;
  dayInPhase: number;
  daysUntilNextPhase: number;
} {
  const dayInCycle = differenceInDays(currentDate, lastPeriodStart);
  
  if (dayInCycle <= 5) {
    return {
      phase: 'menstrual',
      dayInPhase: dayInCycle + 1,
      daysUntilNextPhase: 5 - dayInCycle
    };
  }
  
  if (dayInCycle <= 13) {
    return {
      phase: 'follicular',
      dayInPhase: dayInCycle - 5,
      daysUntilNextPhase: 13 - dayInCycle
    };
  }
  
  if (dayInCycle <= 17) {
    return {
      phase: 'ovulation',
      dayInPhase: dayInCycle - 13,
      daysUntilNextPhase: 17 - dayInCycle
    };
  }
  
  return {
    phase: 'luteal',
    dayInPhase: dayInCycle - 17,
    daysUntilNextPhase: cycleLength - dayInCycle
  };
}

export function getPhaseColor(phase: CyclePhase): string {
  switch (phase) {
    case 'menstrual':
      return 'text-red-500 bg-red-50';
    case 'follicular':
      return 'text-blue-500 bg-blue-50';
    case 'ovulation':
      return 'text-green-500 bg-green-50';
    case 'luteal':
      return 'text-purple-500 bg-purple-50';
    default:
      return 'text-gray-500 bg-gray-50';
  }
}