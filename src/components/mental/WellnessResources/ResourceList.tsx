import React from 'react';
import { motion } from 'framer-motion';
import ResourceCard from './ResourceCard';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  url: string;
}

interface ResourceListProps {
  resources: Resource[];
  searchQuery: string;
  selectedCategory: string;
}

export default function ResourceList({ resources, searchQuery, selectedCategory }: ResourceListProps) {
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
      resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredResources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ResourceCard {...resource} />
        </motion.div>
      ))}
      {filteredResources.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No resources found matching your criteria
        </div>
      )}
    </div>
  );
}