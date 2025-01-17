import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';

interface CommentType {
  id: string;
  content: string;
  created_at: string;
  author?: {
    username: string;
  };
  profiles?: {
    username: string;
  };
}

interface PostProps {
  post: {
    id: string;
    author_id: string;
    images?: string[];
    description?: string;
    tags?: string[];
    likes: number;
    liked?: boolean;
    profiles?: {
      username?: string;
      avatar_url?: string;
    };
    comments?: CommentType[];
  };
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onSave: (postId: string) => void;
  onDelete?: (postId: string) => void; // made optional, in case it's not always provided
  isSaved: boolean;
}

export default function InspirationPost({
  post,
  onLike,
  onComment,
  onSave,
  onDelete,
  isSaved = false,
}: PostProps) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setCurrentUser(user);
      }
    };
    fetchUser();
  }, []);

  // Validate post data
  if (!post || typeof post !== 'object') {
    console.error('Invalid post data:', post);
    return null;
  }

  // Create a safe version of the post with defaults
  const safePost = {
    id: post.id || '',
    author_id: post.author_id || '',
    images: Array.isArray(post.images) ? post.images : [],
    description: post.description || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    likes: typeof post.likes === 'number' ? post.likes : 0,
    liked: Boolean(post.liked),
    profiles: {
      username: post.profiles?.username || 'Anonymous',
      avatar_url: post.profiles?.avatar_url,
    },
    comments: Array.isArray(post.comments) ? post.comments : [],
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onComment(safePost.id, comment.trim());
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    if (!onDelete) return; // If onDelete is truly optional, bail out if not provided
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(safePost.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square">
        {safePost.images[0] ? (
          <img
            src={safePost.images[0]}
            alt={safePost.description || 'Post image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {safePost.profiles.avatar_url && (
              <img
                src={safePost.profiles.avatar_url}
                alt={safePost.profiles.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <p className="text-sm font-medium text-gray-800">
              Posted by:{' '}
              <a
                href={`/profile/${safePost.author_id}`}
                className="text-primary hover:underline"
              >
                {safePost.profiles.username}
              </a>
            </p>
          </div>

          {currentUser?.id === safePost.author_id && onDelete && (
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete post"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-800">{safePost.description}</p>

        {/* Tags */}
        {safePost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {safePost.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <button
              onClick={() => onLike(safePost.id)}
              className={`flex items-center space-x-1 ${
                safePost.liked
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart
                className={safePost.liked ? 'fill-current' : ''}
                size={20}
              />
              <span>{safePost.likes}</span>
            </button>

            {/* Toggle comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary"
            >
              <MessageCircle size={20} />
              <span>{safePost.comments.length}</span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onSave(safePost.id)}
            className={`text-gray-500 hover:text-primary ${
              isSaved ? 'text-primary' : ''
            }`}
            title={isSaved ? 'Remove from saved' : 'Save post'}
          >
            <Bookmark className={isSaved ? 'fill-current' : ''} size={20} />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            {safePost.comments.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {safePost.comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-medium">
                      {comment.profiles?.username ||
                        comment.author?.username ||
                        'Anonymous'}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {comment.content}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}

            {/* Comment Input */}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={!comment.trim() || isSubmitting}>
                Post
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
