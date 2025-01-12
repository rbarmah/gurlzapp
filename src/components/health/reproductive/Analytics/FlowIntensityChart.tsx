import React from 'react';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
// import { CycleDay } from '../../../../types/health';
import { commonOptions } from './chartConfig';

interface FlowIntensityChartProps {
  // cycleDays: Record<string, CycleDay>;
  cycleDays: Record<string, {}>;
  
}

export default function FlowIntensityChart({ cycleDays }: FlowIntensityChartProps) {
  // Add guard clause for undefined/null cycleDays
  if (!cycleDays) {
    return (
      <div className="bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Flow Intensity</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const flowIntensityMap = {
    'light': 1,
    'medium': 2,
    'heavy': 3
  };

  const data = {
    labels: Object.keys(cycleDays).map(date => format(new Date(date), 'MMM d')),
    datasets: [
      {
        label: 'Flow Intensity',
        data: Object.values(cycleDays).map(day => 
          day?.flow ? flowIntensityMap[day.flow as keyof typeof flowIntensityMap] : 0
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 3,
        ticks: {
          callback: (value: number) => {
            const labels = ['None', 'Light', 'Medium', 'Heavy'];
            return labels[value];
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Flow Intensity</h3>
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}