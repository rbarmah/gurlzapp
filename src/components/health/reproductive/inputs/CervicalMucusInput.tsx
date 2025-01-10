import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import Button from '../../../common/Button';
import { CervicalMucusLog } from '../../../../utils/periodTracking/types';

interface Props {
  onSubmit: (log: CervicalMucusLog) => void;
}

const mucusTypes = [
  { value: 'dry', label: 'Dry' },
  { value: 'sticky', label: 'Sticky' },
  { value: 'creamy', label: 'Creamy' },
  { value: 'watery', label: 'Watery' },
  { value: 'egg-white', label: 'Egg White' }
] as const;

export default function CervicalMucusInput({ onSubmit }: Props) {
  const [type, setType] = useState<CervicalMucusLog['type']>('dry');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      date: new Date().toISOString().split('T')[0],
      type,
      notes: notes.trim() || undefined
    });

    setType('dry');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 text-primary">
        <Droplets size={24} />
        <h3 className="text-lg font-semibold">Cervical Mucus</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {mucusTypes.map((mucusType) => (
          <button
            key={mucusType.value}
            type="button"
            onClick={() => setType(mucusType.value)}
            className={`p-3 rounded-xl text-sm transition-colors
              ${type === mucusType.value
                ? 'bg-primary text-white'
                : 'bg-gray-50 hover:bg-gray-100'
              }`}
          >
            {mucusType.label}
          </button>
        ))}
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
          placeholder="Any additional observations..."
        />
      </div>

      <Button type="submit" className="w-full">
        Log Observation
      </Button>
    </form>
  );
}