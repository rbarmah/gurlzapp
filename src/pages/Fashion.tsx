import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useFashionStore } from '../store/fashionStore';
import { useProfileActivity } from '../hooks/useProfileActivity';
import Button from '../components/common/Button';
import InspirationPost from '../components/fashion/InspirationPost';
import TrendSearch from '../components/fashion/TrendSearch';
import UploadModal from '../components/fashion/UploadModal';

export default function Fashion() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    posts,
    savedPosts,
    searchQuery,
    addPost,
    likePost,
    addComment,
    toggleSavePost,
    setSearchQuery
  } = useFashionStore();

  const { logActivity } = useProfileActivity();
  const [showUpload, setShowUpload] = useState(false);

  const filteredPosts = posts.filter(post =>
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUpload = (data: { images: string[]; description: string; tags: string[] }) => {
    const newPost = {
      id: Date.now().toString(),
      ...data,
      likes: 0,
      comments: [],
      timestamp: new Date(),
      author: {
        id: user?.id || 'anonymous',
        username: user?.username || 'Anonymous'
      }
    };
    addPost(newPost);
    logActivity('post', `Shared a new fashion inspiration: ${data.description.slice(0, 50)}...`);
    setShowUpload(false);
  };

  const handleComment = (postId: string, content: string) => {
    addComment(postId, {
      id: Date.now().toString(),
      authorId: user?.id || 'anonymous',
      authorName: user?.username || 'Anonymous',
      content,
      timestamp: new Date()
    });
    logActivity('comment', `Commented on a fashion post: ${content.slice(0, 50)}...`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-4">Gurlture!</h1>
        <p className="text-secondary-light/90">Share your beautiful pictures with the community!</p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <TrendSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="mr-2" size={20} />
            Share Inspiration
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/saved-ideas')}
          >
            <Bookmark className="mr-2" size={20} />
            Saved Ideas
          </Button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <InspirationPost
              post={post}
              onLike={likePost}
              onComment={handleComment}
              onSave={toggleSavePost}
              isSaved={savedPosts.some(saved => saved.id === post.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onUpload={handleUpload}
          />
        )}
      </AnimatePresence>
    </div>
  );
}