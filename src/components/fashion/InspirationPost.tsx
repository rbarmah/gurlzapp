import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { FashionPost } from '../../types/fashion';
import Button from '../common/Button';

interface InspirationPostProps {
  post: FashionPost;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onSave: (postId: string) => void;
  isSaved?: boolean;
}

export default function InspirationPost({ 
  post, 
  onLike, 
  onComment, 
  onSave,
  isSaved 
}: InspirationPostProps) {
  const [comment, setComment] = React.useState('');
  const [showComments, setShowComments] = React.useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onComment(post.id, comment);
    setComment('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={post.images[0]}
          alt={post.description}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-1 ${
                post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={post.liked ? 'fill-current' : ''} size={20} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary"
            >
              <MessageCircle size={20} />
              <span>{post.comments.length}</span>
            </button>
          </div>
          <button
            onClick={() => onSave(post.id)}
            className={`text-gray-500 hover:text-primary ${isSaved ? 'text-primary' : ''}`}
          >
            <Bookmark className={isSaved ? 'fill-current' : ''} size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-800">{post.description}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            {post.comments.map((comment, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{comment.authorName}</span>
                <span className="ml-2 text-gray-600">{comment.content}</span>
              </div>
            ))}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" disabled={!comment.trim()}>
                Post
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}