import api from './client';
import { ApiResponse } from './types';
import { DailyQuote } from '../../types/quotes';
import { MoodEntry } from '../../types/mental';

export const mental = {
  getMoodHistory: () => 
    api.get<ApiResponse<MoodEntry[]>>('/mental/mood/history'),
  
  recordMood: (data: Omit<MoodEntry, 'id' | 'timestamp'>) =>
    api.post<ApiResponse<MoodEntry>>('/mental/mood', data),
    
  scheduleAppointment: (data: { date: string; time: string; description: string }) =>
    api.post<ApiResponse<void>>('/mental/appointments', data),
    
  getAppointments: () =>
    api.get<ApiResponse<any[]>>('/mental/appointments'),

  getDailyQuote: () =>
    api.get<ApiResponse<DailyQuote>>('/mental/daily-quote')
};

export default mental;