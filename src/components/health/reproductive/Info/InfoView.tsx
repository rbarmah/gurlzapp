import React from 'react';
import { motion } from 'framer-motion';
import ArticleCard from './ArticleCard';
import VideoCard from './VideoCard';

const articles = [
  {
    id: '1',
    title: 'Understanding Your Menstrual Cycle',
    description: 'A comprehensive guide to the four phases of your menstrual cycle and what happens during each phase.',
    readTime: '5 min',
    imageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=800'
  },
  {
    id: '2',
    title: 'Nutrition Tips for Better Reproductive Health',
    description: 'Learn about the best foods and nutrients to support your reproductive health.',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800'
  }
];

const videos = [
  {
    id: '1',
    title: 'Exercise Routines for Menstrual Pain Relief',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800',
    duration: '5:30'
  },
  {
    id: '2',
    title: 'Meditation for Hormonal Balance',
    thumbnail: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800',
    duration: '8:45'
  }
];

export default function InfoView() {
  return (
    <div className="space-y-8">
      {/* Articles Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ArticleCard
                {...article}
                onClick={() => console.log('Open article:', article.id)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Videos Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Educational Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VideoCard
                {...video}
                onClick={() => console.log('Play video:', video.id)}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}