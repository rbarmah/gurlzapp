import React from 'react';
import { motion } from 'framer-motion';

const wellnessImages = {
  bath: "https://images.unsplash.com/photo-1532926381892-7a8c15b504c6",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
  tea: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12",
  meditation: "https://images.unsplash.com/photo-1506126613408-eca07ce68773"
};

const factImages = {
  science: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69",
  wellness: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
  health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528"
};

export default function DailyInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="relative h-48">
          <img 
            src={factImages.wellness} 
            alt="Wellness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
            Did You Know?
          </h3>
        </div>
        <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <p className="text-gray-700">
            During your period, your body's pain tolerance actually increases, making you naturally stronger! 
            This is due to the release of endorphins, your body's natural painkillers.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="relative h-48">
          <img 
            src={wellnessImages.meditation} 
            alt="Self Care"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
            Today's Self-Care Ideas
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(wellnessImages).map(([key, url], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-lg overflow-hidden aspect-square group cursor-pointer"
              >
                <img 
                  src={url} 
                  alt={key}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium capitalize">{key}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}