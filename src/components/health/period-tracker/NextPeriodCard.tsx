import React from 'react';
import { format, addDays } from 'date-fns';
import { Moon } from 'lucide-react';

interface NextPeriodCardProps {
  startDate: Date;
  lastPeriodLength: number;
}

export default function NextPeriodCard({ startDate, lastPeriodLength }: NextPeriodCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl border-2 border-primary/10">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary">Next period</h3>
          <p className="text-sm text-gray-500">{format(startDate, 'do MMMM')}</p>
          <p className="text-sm text-gray-500">
            Your last period lasted {lastPeriodLength} days
          </p>
        </div>
        <div className="text-sm text-primary">
          in 3 Weeks
        </div>
      </div>
    </div>
  );
}