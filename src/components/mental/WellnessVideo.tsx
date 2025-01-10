import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

export default function WellnessVideo() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Demo video data
  const video = {
    title: "5-Minute Mindfulness Practice",
    description: "Start your day with this guided mindfulness exercise to reduce stress and increase focus.",
    url: "https://www.youtube.com/embed/inpok4MKVLM",
    instructor: "Sarah Johnson",
    duration: "5:00",
    views: 1234,
    likes: 456
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/mental')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Mental Wellness
        </Button>
        <h1 className="text-3xl font-bold mb-2">Daily Wellness Video</h1>
        <p className="text-secondary-light/90">Your daily dose of mental wellness</p>
      </div>

      {/* Video Player */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="aspect-video">
          <iframe
            src={video.url}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{video.title}</h2>
              <p className="text-gray-500 mt-1">
                with {video.instructor} • {video.duration}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setLiked(!liked)}
                className={`flex items-center space-x-1 ${
                  liked ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                <ThumbsUp size={20} className={liked ? 'fill-current' : ''} />
                <span>{liked ? video.likes + 1 : video.likes}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSaved(!saved)}
                className={`flex items-center space-x-1 ${
                  saved ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                <Bookmark size={20} className={saved ? 'fill-current' : ''} />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-gray-500 hover:text-primary"
              >
                <Share2 size={20} />
              </motion.button>
            </div>
          </div>

          <p className="text-gray-700">{video.description}</p>

          {/* Comments Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle size={20} className="mr-2" />
              Discussion
            </h3>
            <div className="space-y-4">
              <textarea
                placeholder="Share your thoughts..."
                className="w-full p-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
              />
              <Button>Post Comment</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Next Up */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Coming Tomorrow</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900">Stress Management Techniques</h4>
          <p className="text-sm text-gray-500 mt-1">
            Learn practical techniques to manage daily stress and anxiety
          </p>
        </div>
      </div>
    </div>
  );
}