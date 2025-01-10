import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FashionPost, SavedInspiration, Comment } from '../types/fashion';

interface FashionState {
  posts: FashionPost[];
  savedPosts: SavedInspiration[];
  searchQuery: string;
  addPost: (post: FashionPost) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  toggleSavePost: (postId: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useFashionStore = create<FashionState>()(
  persist(
    (set) => ({
      posts: [],
      savedPosts: [],
      searchQuery: '',

      addPost: (post) => set((state) => ({
        posts: [post, ...state.posts]
      })),

      likePost: (postId) => set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
            : post
        )
      })),

      addComment: (postId, comment) => set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      })),

      toggleSavePost: (postId) => set((state) => {
        const post = state.posts.find(p => p.id === postId);
        if (!post) return state;

        const isCurrentlySaved = state.savedPosts.some(s => s.id === postId);
        
        return {
          savedPosts: isCurrentlySaved
            ? state.savedPosts.filter(p => p.id !== postId)
            : [...state.savedPosts, { ...post, savedAt: new Date() }]
        };
      }),

      setSearchQuery: (query) => set({ searchQuery: query })
    }),
    {
      name: 'fashion-storage'
    }
  )
);