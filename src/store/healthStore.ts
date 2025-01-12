import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CycleData } from '../types/health';
import { getCyclePredictions } from '../utils/periodTracking';

interface HealthState {
  cycles: CycleData[];
  addCycle: (cycle: CycleData) => void;
  logPeriodStart: (startDate: Date) => void;
  logPeriodEnd: (endDate: Date) => void;
  getPredictions: () => ReturnType<typeof getCyclePredictions>;
  clearData: () => void;
  updateCycle: (index: number, updatedCycle: Partial<CycleData>) => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      // Initial state
      cycles: [],

      // Add a new cycle directly
      addCycle: (cycle: CycleData) => {
        set((state) => ({
          cycles: [...state.cycles, cycle],
        }));
        console.log('addCycle - Added cycle:', cycle);
      },

      // Log the start of a period and calculate default end date
      logPeriodStart: (startDate: Date) => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 5); // Default period length of 5 days

        set((state) => {
          const newCycle: CycleData = {
            startDate,
            endDate,
            length: 28, // Default cycle length
          };
          console.log('logPeriodStart - Adding cycle:', newCycle);
          return { cycles: [...state.cycles, newCycle] };
        });
      },

      // Log the end date of the most recent period
      logPeriodEnd: (endDate: Date) => {
        set((state) => {
          const cycles = [...state.cycles];
          if (cycles.length > 0) {
            const lastCycle = cycles[cycles.length - 1];
            if (!lastCycle.endDate || new Date(lastCycle.endDate) < endDate) {
              lastCycle.endDate = endDate;
              lastCycle.length = Math.ceil(
                (endDate.getTime() - new Date(lastCycle.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              console.log('logPeriodEnd - Updated last cycle:', lastCycle);
            } else {
              console.error('logPeriodEnd - End date is earlier than the start date.');
            }
          }
          return { cycles };
        });
      },

      // Clear all cycle data
      clearData: () => {
        console.log('Clearing all cycles');
        set({ cycles: [] });
      },

      // Get predictions for future cycles
      getPredictions: () => {
        const cycles = get().cycles.map((cycle) => ({
          start: (cycle.startDate instanceof Date ? cycle.startDate : new Date(cycle.startDate)).toISOString(),
          end: (cycle.endDate instanceof Date ? cycle.endDate : new Date(cycle.endDate)).toISOString(),
        }));
        return getCyclePredictions({ periods: cycles });
      },

      // Update a specific cycle by index
      updateCycle: (index: number, updatedCycle: Partial<CycleData>) => {
        set((state) => {
          const cycles = [...state.cycles];
          if (index >= 0 && index < cycles.length) {
            cycles[index] = { ...cycles[index], ...updatedCycle };
            console.log('updateCycle - Updated cycle:', cycles[index]);
          } else {
            console.error('updateCycle - Invalid cycle index:', index);
          }
          return { cycles };
        });
      },
    }),
    {
      name: 'health-storage',
      partialize: (state) => ({ cycles: state.cycles }),
    }
  )
);
