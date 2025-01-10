import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../common/Button';

interface Props {
  onSubmit: (data: { symptoms: string[]; flow?: 'light' | 'medium' | 'heavy' }) => void;
}

const symptoms = [
  'Cramps',
  'Headache',
  'Bloating',
  'Fatigue',
  'Mood Swings',
  'Breast Tenderness',
  'Acne',
  'Back Pain',
  'Nausea'
];

const flowOptions = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' }
] as const;

export default function SymptomsInput({ onSubmit }: Props) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      symptoms: selectedSymptoms,
      flow
    });
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Symptoms</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {symptoms.map(symptom => (
            <button
              key={symptom}
              type="button"
              onClick={() => toggleSymptom(symptom)}
              className={`p-3 rounded-xl text-sm transition-colors
                ${selectedSymptoms.includes(symptom)
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Flow</h4>
        <div className="flex space-x-4">
          {flowOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFlow(option.value)}
              className={`flex-1 p-3 rounded-xl text-sm transition-colors
                ${flow === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Symptoms
      </Button>
    </form>
  );
}