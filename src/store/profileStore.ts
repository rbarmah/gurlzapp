import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase'; // Ensure you have Supabase client setup
import { UserProfile, UserActivity, ChatHistoryItem } from '../types/profile';

interface ProfileState {
  profiles: Record<string, UserProfile>;
  activities: UserActivity[];
  chatHistory: ChatHistoryItem[];
  searchHistory: string[];

  addProfile: (profile: UserProfile) => void;
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  addChatHistoryItem: (chat: Omit<ChatHistoryItem, 'id' | 'timestamp'>) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  fetchChatHistory: (userId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: {},
      activities: [],
      chatHistory: [],
      searchHistory: [],

      addProfile: (profile) =>
        set((state) => ({
          profiles: { ...state.profiles, [profile.id]: profile },
        })),

      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: {
            ...state.profiles,
            [id]: { ...state.profiles[id], ...updates },
          },
        })),

      addActivity: (activity) =>
        set((state) => ({
          activities: [
            {
              ...activity,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
            ...state.activities,
          ],
        })),

      addChatHistoryItem: (chat) =>
        set((state) => ({
          chatHistory: [
            {
              ...chat,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
            ...state.chatHistory,
          ],
        })),

      addToSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [
            query,
            ...state.searchHistory.filter((q) => q !== query).slice(0, 9),
          ],
        })),

      clearSearchHistory: () => set({ searchHistory: [] }),

      fetchChatHistory: async (userId) => {
        try {
          const { data, error } = await supabase
            .from('chat_messages') // Replace with your table name
            .select('*')
            .eq('user_id', userId); // Replace with your column name for user ID

          if (error) {
            console.error('Error fetching chat history:', error);
            return;
          }

          // Separate main messages and replies
          const mainMessages = data.filter((message) => !message.reply_to); // Main messages have no reply_to
          const replies = data.filter((message) => message.reply_to); // Replies have a reply_to

          // Map main messages with their replies
          const chatHistory = mainMessages.map((chat) => ({
            ...chat,
            timestamp: new Date(chat.timestamp), // Convert to Date object
            replies: replies
              .filter((reply) => reply.reply_to === chat.id) // Match replies to main message
              .map((reply) => ({
                ...reply,
                timestamp: new Date(reply.timestamp),
              })),
          }));

          set(() => ({ chatHistory })); // Update the state with fetched chat history
        } catch (err) {
          console.error('Unexpected error fetching chat history:', err);
        }
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);
