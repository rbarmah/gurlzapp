export interface ChatMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  isAnonymous: boolean;
  isSuitableForMinors: boolean;
  timestamp: string;
  likes: number;
  liked?: boolean;
  likedBy?: string[];
  comments: Comment[];
  viewCount?: number;
  color?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  isAnonymous: boolean;
  timestamp: string;
  likes: number;
  liked?: boolean;
  likedBy?: string[];
  replies?: Comment[];
}