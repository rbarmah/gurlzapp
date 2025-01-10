import React from 'react';
import { Footprints } from 'lucide-react';

interface PedometerCardProps {
  steps: number;
  goal: number;
}

export default function PedometerCard({ steps, goal }: PedometerCardProps) {
  const progress = (steps / goal) * 100;

  return (
    <div className="p-4 bg-white rounded-xl border-2 border-primary/10">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary">Pedometer</h3>
          <p className="text-sm text-gray-500">
            {steps.toLocaleString()} steps today
          </p>
          <p className="text-xs text-gray-400">Synced to Google Fit</p>
        </div>
        <div className="flex items-center space-x-2">
          <Footprints className="w-6 h-6 text-primary" />
          <div className="text-sm text-primary">
            {progress >= 100 ? 'Goal reached!' : `${Math.round(progress)}% of goal`}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}