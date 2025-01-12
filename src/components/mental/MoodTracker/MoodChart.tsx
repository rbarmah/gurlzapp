import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { format, subDays } from 'date-fns';
import { MoodEntry } from '../../../types/mental';

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

interface MoodChartProps {
  entries: MoodEntry[];
  days?: number;
}

export default function MoodChart({ entries, days = 7 }: MoodChartProps) {
  const moodValues = {
    'happy': 3,
    'neutral': 2,
    'sad': 1,
  };

  const dates = Array.from({ length: days }, (_, i) => subDays(new Date(), i)).reverse();

  const data = {
    labels: dates.map(date => format(date, 'MMM d')),
    datasets: [
      {
        label: 'Mood',
        data: dates.map(date => {
          const entry = entries.find(e =>
            format(e.timestamp, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );
          return entry ? moodValues[entry.mood as keyof typeof moodValues] : null;
        }),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: (value: number) => {
            return ['', 'Sad', 'Neutral', 'Happy'][value] || '';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Mood Trends</h3>
      <Line data={data} options={options} />
    </div>
  );
}
