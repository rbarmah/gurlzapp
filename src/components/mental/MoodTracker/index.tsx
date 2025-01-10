import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMentalStore } from '../../../store/mentalStore';
import Button from '../../common/Button';
import MoodInput from './MoodInput';
import MoodChart from './MoodChart';
import MoodAnalysis from './MoodAnalysis';

export default function MoodTracker() {
  const navigate = useNavigate();
  const { moodEntries, addMoodEntry } = useMentalStore();
  const [selectedMood, setSelectedMood] = useState<string>();
  const [selectedEnergy, setSelectedEnergy] = useState<string>();
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!selectedMood || !selectedEnergy) return;

    addMoodEntry({
      mood: selectedMood,
      energy: selectedEnergy,
      note: note.trim(),
      timestamp: new Date()
    });

    // Reset form
    setSelectedMood(undefined);
    setSelectedEnergy(undefined);
    setNote('');
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
        <h1 className="text-3xl font-bold mb-2">Mood Tracker</h1>
        <p className="text-secondary-light/90">Track and understand your emotional well-being</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 space-y-6"
        >
          <MoodInput
            onMoodSelect={setSelectedMood}
            onEnergySelect={setSelectedEnergy}
            selectedMood={selectedMood}
            selectedEnergy={selectedEnergy}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              rows={3}
              placeholder="How are you feeling today?"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!selectedMood || !selectedEnergy}
            className="w-full"
          >
            Save Entry
          </Button>
        </motion.div>

        {/* Analysis Section */}
        <div className="space-y-8">
          <MoodChart entries={moodEntries} />
          <MoodAnalysis entries={moodEntries} />
        </div>
      </div>
    </div>
  );
}