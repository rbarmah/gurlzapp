import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { CycleDay } from '../../../../types/health';
import { commonOptions } from './chartConfig';

interface LifestyleCorrelationChartProps {
  cycleDays: Record<string, CycleDay>;
}

export default function LifestyleCorrelationChart({ cycleDays }: LifestyleCorrelationChartProps) {
  const data = {
    datasets: [
      {
        label: 'Sleep vs Symptoms',
        data: Object.values(cycleDays)
          .filter(day => day.lifestyle?.sleep)
          .map(day => ({
            x: day.lifestyle?.sleep?.duration || 0,
            y: (day.symptoms?.length || 0),
          })),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
      }
    ]
  };

  const options = {
    ...commonOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sleep Duration (hours)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Symptoms'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Impact</h3>
      <div className="h-[300px]">
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
}