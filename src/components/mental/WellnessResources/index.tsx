import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../common/Button';
import ResourceFilters from './ResourceFilters';
import ResourceList from './ResourceList';

// Demo resources data
const demoResources = [
  {
    id: '1',
    title: 'Understanding and Managing Anxiety',
    description: 'Learn about the different types of anxiety and effective coping strategies.',
    category: 'Anxiety',
    readTime: '10 min',
    url: '#'
  },
  {
    id: '2',
    title: 'Building Healthy Sleep Habits',
    description: 'Practical tips for improving your sleep quality and establishing a bedtime routine.',
    category: 'Sleep',
    readTime: '8 min',
    url: '#'
  },
  {
    id: '3',
    title: 'Stress Management Techniques',
    description: 'Discover proven methods to reduce stress and maintain emotional balance.',
    category: 'Stress',
    readTime: '12 min',
    url: '#'
  },
  {
    id: '4',
    title: 'Nurturing Healthy Relationships',
    description: 'Tips for building and maintaining meaningful connections with others.',
    category: 'Relationships',
    readTime: '15 min',
    url: '#'
  },
  {
    id: '5',
    title: 'Self-Care Practices for Mental Health',
    description: 'Essential self-care strategies to support your mental well-being.',
    category: 'Self-Care',
    readTime: '7 min',
    url: '#'
  },
  {
    id: '6',
    title: 'Understanding Depression',
    description: 'Learn about depression symptoms, causes, and treatment options.',
    category: 'Depression',
    readTime: '10 min',
    url: '#'
  }
];

export default function WellnessResources() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        <h1 className="text-3xl font-bold mb-2">Wellness Resources</h1>
        <p className="text-secondary-light/90">Explore our curated mental health resources</p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <ResourceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ResourceList
          resources={demoResources}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
}