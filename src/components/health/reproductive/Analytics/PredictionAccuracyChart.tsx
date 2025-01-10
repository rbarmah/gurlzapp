import React from 'react';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Cycle } from '../../../../types/health';
import { commonOptions } from './chartConfig';

interface PredictionAccuracyChartProps {
  cycles: Cycle[];
}

export default function PredictionAccuracyChart({ cycles }: PredictionAccuracyChartProps) {
  const recentCycles = cycles.slice(-6);
  
  const data = {
    labels: recentCycles.map(cycle => format(cycle.startDate, 'MMM yyyy')),
    datasets: [
      {
        label: 'Predicted Length',
        data: recentCycles.map(cycle => cycle.predictedNextDate ? 
          Math.abs(cycle.length - cycle.predictedLength || 0) : null
        ),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Days Off (Prediction vs Actual)'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Accuracy</h3>
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}