import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import Button from '../../../common/Button';
import { LifestyleFactors } from '../../../../utils/periodTracking/types';

interface Props {
  onSubmit: (factors: LifestyleFactors) => void;
}

export default function LifestyleFactorsInput({ onSubmit }: Props) {
  const [factors, setFactors] = useState<LifestyleFactors>({
    recentHormonalBCChange: false,
    significantWeightChange: 0,
    highStress: false,
    majorLifestyleChange: false,
    recentIllness: false,
    travelTimeZones: false,
    medicationsAffectingCycle: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(factors);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-2 text-primary">
        <Activity size={24} />
        <h3 className="text-lg font-semibold">Lifestyle Factors</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hormonalBC"
            checked={factors.recentHormonalBCChange}
            onChange={(e) => setFactors(prev => ({
              ...prev,
              recentHormonalBCChange: e.target.checked
            }))}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="hormonalBC" className="text-gray-700">
            Recent changes in hormonal birth control
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recent weight change (in kg, if any)
          </label>
          <input
            type="number"
            value={factors.significantWeightChange || ''}
            onChange={(e) => setFactors(prev => ({
              ...prev,
              significantWeightChange: parseFloat(e.target.value) || 0
            }))}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="0"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="stress"
            checked={factors.highStress}
            onChange={(e) => setFactors(prev => ({
              ...prev,
              highStress: e.target.checked
            }))}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="stress" className="text-gray-700">
            Experiencing high stress levels
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="lifestyle"
            checked={factors.majorLifestyleChange}
            onChange={(e) => setFactors(prev => ({
              ...prev,
              majorLifestyleChange: e.target.checked
            }))}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="lifestyle" className="text-gray-700">
            Major lifestyle changes
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="illness"
            checked={factors.recentIllness}
            onChange={(e) => setFactors(prev => ({
              ...prev,
              recentIllness: e.target.checked
            }))}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="illness" className="text-gray-700">
            Recent illness
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="travel"
            checked={factors.travelTimeZones}
            onChange={(e) => setFactors(prev => ({
              ...prev,
              travelTimeZones: e.target.checked
            }))}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="travel" className="text-gray-700">
            Recent travel across time zones
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="medications"
            checked={factors.medicationsAffectingCycle}
            onChange={(e) => setFactors(prev => ({
              ...prev,
              medicationsAffectingCycle: e.target.checked
            }))}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="medications" className="text-gray-700">
            Taking medications that might affect cycle
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Update Lifestyle Factors
      </Button>
    </form>
  );
}