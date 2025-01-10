import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../../common/Button';
import BBTInput from './inputs/BBTInput';
import CervicalMucusInput from './inputs/CervicalMucusInput';
import LifestyleFactorsInput from './inputs/LifestyleFactorsInput';
import SymptomsInput from './inputs/SymptomsInput';

interface SymptomsModalProps {
  onClose: () => void;
  onSubmit: (data: {
    symptoms: string[];
    flow?: 'light' | 'medium' | 'heavy';
    bbt?: number;
    cervicalMucus?: string;
    lifestyleFactors?: any;
  }) => void;
}

export default function SymptomsModal({ onClose, onSubmit }: SymptomsModalProps) {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [formData, setFormData] = useState({
    symptoms: [] as string[],
    flow: undefined as 'light' | 'medium' | 'heavy' | undefined,
    bbt: undefined as number | undefined,
    cervicalMucus: undefined as string | undefined,
    lifestyleFactors: undefined as any
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const tabs = [
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'bbt', label: 'Temperature' },
    { id: 'mucus', label: 'Cervical Mucus' },
    { id: 'lifestyle', label: 'Lifestyle' }
  ];

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
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-primary">Log Symptoms & Data</h3>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600" size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'symptoms' && (
              <SymptomsInput
                onSubmit={(data) => setFormData(prev => ({ ...prev, ...data }))}
              />
            )}
            {activeTab === 'bbt' && (
              <BBTInput
                onSubmit={(data) => setFormData(prev => ({ ...prev, bbt: data.temperature }))}
              />
            )}
            {activeTab === 'mucus' && (
              <CervicalMucusInput
                onSubmit={(data) => setFormData(prev => ({ ...prev, cervicalMucus: data.type }))}
              />
            )}
            {activeTab === 'lifestyle' && (
              <LifestyleFactorsInput
                onSubmit={(data) => setFormData(prev => ({ ...prev, lifestyleFactors: data }))}
              />
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save All Data
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}