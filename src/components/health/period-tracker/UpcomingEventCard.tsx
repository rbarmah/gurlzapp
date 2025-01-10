import React from 'react';
import { format, differenceInDays } from 'date-fns';

interface UpcomingEventCardProps {
  title: string;
  date: Date;
  icon: string;
}

export default function UpcomingEventCard({ title, date, icon }: UpcomingEventCardProps) {
  const daysUntil = differenceInDays(date, new Date());

  return (
    <div className="p-4 bg-white rounded-xl border-2 border-primary/10">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <p className="text-sm text-gray-500">{format(date, 'do MMMM')}</p>
          <button className="mt-2 text-sm text-primary">
            Tap to view your Calendar
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-sm text-primary">
            in {daysUntil} Days
          </span>
        </div>
      </div>
    </div>
  );
}