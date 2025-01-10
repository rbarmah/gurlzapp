import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';
import Button from '../../../common/Button';
import { BBTLog } from '../../../../utils/periodTracking/types';

interface Props {
  onSubmit: (log: BBTLog) => void;
}

export default function BBTInput({ onSubmit }: Props) {
  const [temperature, setTemperature] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!temperature || !time) return;

    onSubmit({
      date: new Date().toISOString().split('T')[0],
      temperature: parseFloat(temperature),
      time,
      notes: notes.trim() || undefined
    });

    setTemperature('');
    setTime('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 text-primary">
        <Thermometer size={24} />
        <h3 className="text-lg font-semibold">Basal Body Temperature</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.01"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="36.50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Taken
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          rows={2}
          placeholder="Any factors that might affect your temperature..."
        />
      </div>

      <Button type="submit" className="w-full">
        Log Temperature
      </Button>
    </form>
  );
}