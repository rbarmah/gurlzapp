import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { CycleDay } from '../../../../types/health';
import { commonOptions } from './chartConfig';

interface SymptomCorrelationChartProps {
  cycleDays: Record<string, CycleDay>;
}

export default function SymptomCorrelationChart({ cycleDays }: SymptomCorrelationChartProps) {
  const symptoms = ['cramps', 'headache', 'bloating', 'fatigue', 'mood'];
  const dates = Object.keys(cycleDays).sort();

  const data = {
    labels: dates.map(date => format(new Date(date), 'MMM d')),
    datasets: symptoms.map((symptom, index) => ({
      label: symptom.charAt(0).toUpperCase() + symptom.slice(1),
      data: dates.map(date => 
        cycleDays[date].symptoms?.includes(symptom) ? 1 : 0
      ),
      borderColor: `hsl(${index * 60}, 70%, 60%)`,
      backgroundColor: `hsla(${index * 60}, 70%, 60%, 0.1)`,
      fill: true,
      tension: 0.4
    }))
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (value: number) => value === 1 ? 'Yes' : 'No'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Symptom Patterns</h3>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}