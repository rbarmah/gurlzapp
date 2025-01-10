import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Moon } from 'lucide-react';

interface MoodInputProps {
  onMoodSelect: (mood: string) => void;
  onEnergySelect: (energy: string) => void;
  selectedMood?: string;
  selectedEnergy?: string;
}

const moods = [
  { value: 'happy', icon: Smile, label: 'Happy', color: 'bg-green-500' },
  { value: 'neutral', icon: Meh, label: 'Neutral', color: 'bg-yellow-500' },
  { value: 'sad', icon: Frown, label: 'Sad', color: 'bg-blue-500' }
];

const energyLevels = [
  { value: 'high', icon: Sun, label: 'High', color: 'bg-amber-500' },
  { value: 'medium', icon: Cloud, label: 'Medium', color: 'bg-gray-500' },
  { value: 'low', icon: CloudRain, label: 'Low', color: 'bg-indigo-500' },
  { value: 'tired', icon: Moon, label: 'Tired', color: 'bg-violet-500' }
];

export default function MoodInput({ 
  onMoodSelect, 
  onEnergySelect, 
  selectedMood,
  selectedEnergy 
}: MoodInputProps) {
  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h3>
        <div className="grid grid-cols-3 gap-4">
          {moods.map(({ value, icon: Icon, label, color }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMoodSelect(value)}
              className={`p-4 rounded-xl flex flex-col items-center space-y-2 transition-colors
                ${selectedMood === value ? color + ' text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <Icon size={32} />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Energy Level Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Level</h3>
        <div className="grid grid-cols-4 gap-4">
          {energyLevels.map(({ value, icon: Icon, label, color }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEnergySelect(value)}
              className={`p-4 rounded-xl flex flex-col items-center space-y-2 transition-colors
                ${selectedEnergy === value ? color + ' text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <Icon size={24} />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}