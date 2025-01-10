import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CycleData } from '../types/health';
import { differenceInDays } from 'date-fns';

interface HealthState {
  cycles: CycleData[];
  logPeriodStart: (date: Date) => void;
  logPeriodEnd: (date: Date) => void;
  getCycles: () => CycleData[];
  clearData: () => void;
  getAnalytics: () => {
    avgCycleLength: number;
    avgPeriodLength: number;
    regularityScore: number;
    symptoms: Record<string, number>;
  };
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      cycles: [],

      logPeriodStart: (date: Date) => {
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 5);

        set((state) => ({
          cycles: [...state.cycles, {
            startDate: date,
            endDate,
            symptoms: [],
            bbtData: [],
            mucusData: [],
            notes: ''
          }]
        }));
      },

      logPeriodEnd: (date: Date) => {
        set((state) => {
          const cycles = [...state.cycles];
          if (cycles.length > 0) {
            const lastCycle = cycles[cycles.length - 1];
            cycles[cycles.length - 1] = {
              ...lastCycle,
              endDate: date
            };
          }
          return { cycles };
        });
      },

      clearData: () => set({ cycles: [] }),

      getCycles: () => get().cycles,

      getAnalytics: () => {
        const cycles = get().cycles;
        
        // Default values if no cycles exist
        if (cycles.length === 0) {
          return {
            avgCycleLength: 0,
            avgPeriodLength: 0,
            regularityScore: 0,
            symptoms: {}
          };
        }

        // Calculate cycle lengths
        const cycleLengths = cycles.slice(0, -1).map((cycle, index) => {
          const nextCycle = cycles[index + 1];
          return differenceInDays(nextCycle.startDate, cycle.startDate);
        });

        // Calculate period lengths
        const periodLengths = cycles.map(cycle =>
          differenceInDays(cycle.endDate, cycle.startDate) + 1
        );

        // Calculate averages
        const avgCycleLength = cycleLengths.length > 0
          ? cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
          : 28; // Default cycle length if only one cycle

        const avgPeriodLength = periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length;

        // Calculate regularity score
        const regularityScore = cycleLengths.length > 0
          ? Math.max(0, 100 - (calculateVariance(cycleLengths) * 2))
          : 0;

        // Aggregate symptoms
        const symptoms = cycles.reduce((acc, cycle) => {
          cycle.symptoms.forEach(symptom => {
            acc[symptom] = (acc[symptom] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>);

        return {
          avgCycleLength,
          avgPeriodLength,
          regularityScore,
          symptoms
        };
      }
    }),
    {
      name: 'health-storage',
      partialize: (state) => ({
        cycles: state.cycles
      })
    }
  )
);

// Helper function to calculate variance
function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squareDiffs = numbers.map(value => Math.pow(value - mean, 2));
  return squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
}