import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserActivity } from '../types/profile';

interface ActivityStore {
  activities: UserActivity[];
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  getActivitiesByUser: (userId: string) => UserActivity[];
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: [],
      
      addActivity: (activity) => set((state) => ({
        activities: [
          {
            ...activity,
            id: Date.now().toString(),
            timestamp: new Date()
          },
          ...state.activities
        ].slice(0, 100) // Keep only last 100 activities
      })),
      
      getActivitiesByUser: (userId) => {
        return get().activities
          .filter(activity => activity.userId === userId)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      },

      clearActivities: () => set({ activities: [] })
    }),
    {
      name: 'activity-storage',
      partialize: (state) => ({
        activities: state.activities.map(activity => ({
          ...activity,
          timestamp: activity.timestamp.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert ISO strings back to Date objects
          state.activities = state.activities.map(activity => ({
            ...activity,
            timestamp: new Date(activity.timestamp)
          }));
        }
      }
    }
  )
);