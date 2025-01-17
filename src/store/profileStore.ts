import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
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
        if (!userId) {
          console.error('No userId provided to fetchChatHistory');
          return;
        }

        try {
          console.log('Fetching chat history for user:', userId);
          
          // First, fetch all messages (both main messages and replies) for this user
          const { data: allMessages, error: messagesError } = await supabase
            .from('chat_messages')
            .select(`
              *,
              likes:chat_likes(count)
            `)
            .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
            .order('created_at', { ascending: false });

          if (messagesError) {
            console.error('Error fetching chat messages:', messagesError);
            return;
          }

          // Separate main messages and replies
          const mainMessages = allMessages.filter(msg => !msg.parent_id);
          const replies = allMessages.filter(msg => msg.parent_id);

          // Transform the data to include replies with their parent messages
          const chatHistory = mainMessages.map(message => {
            const messageReplies = replies.filter(reply => reply.parent_id === message.id);
            const likesCount = message.likes?.[0]?.count || 0;

            return {
              id: message.id,
              content: message.content,
              userId: message.user_id,
              recipientId: message.recipient_id,
              isAnonymous: message.is_anonymous || false,
              timestamp: message.created_at,
              likes: likesCount,
              comments: messageReplies.map(reply => ({
                id: reply.id,
                content: reply.content,
                userId: reply.user_id,
                timestamp: reply.created_at,
                likes: reply.likes?.[0]?.count || 0
              }))
            };
          });

          console.log('Processed chat history:', chatHistory);
          set({ chatHistory });

        } catch (err) {
          console.error('Unexpected error fetching chat history:', err);
        }
      },
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({
        profiles: state.profiles,
        searchHistory: state.searchHistory,
      }),
    }
  )
);