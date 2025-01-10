import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Tag, Plus } from 'lucide-react';
import Button from '../common/Button';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (data: {
    images: string[];
    description: string;
    tags: string[];
  }) => void;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      alert('You can only upload up to 4 images');
      return;
    }

    // Convert files to URLs for preview
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(imageUrls);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleSubmit = () => {
    if (!description.trim() || images.length === 0) return;

    onUpload({
      images,
      description: description.trim(),
      tags: tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-primary">Share Fashion Inspiration</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images (Max 4)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {images.length < 4 && (
                <label className="aspect-square border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 transition-colors cursor-pointer flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                    max={4}
                  />
                  <Upload className="w-8 h-8 text-gray-400" />
                </label>
              )}
              {images.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              rows={3}
              placeholder="Share your fashion story..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Max 5)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
                >
                  #{tag}
                  <button
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="ml-1"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            {tags.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 p-2 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Add a tag..."
                />
                <Button onClick={handleAddTag} variant="outline" size="sm">
                  <Plus size={20} />
                </Button>
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!description.trim() || images.length === 0}>
            Share Inspiration
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}