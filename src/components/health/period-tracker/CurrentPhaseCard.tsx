import React from 'react';
import { format } from 'date-fns';
import { Flower2 } from 'lucide-react';

interface CurrentPhaseCardProps {
  phase: string;
  date: Date;
}

export default function CurrentPhaseCard({ phase, date }: CurrentPhaseCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl border-2 border-primary/10">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary">Now • {phase}</h3>
          <p className="text-sm text-gray-500">{format(date, 'do MMMM')}</p>
          <button className="mt-2 text-sm text-primary">
            Tap to see next period start date
          </button>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Flower2 className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}