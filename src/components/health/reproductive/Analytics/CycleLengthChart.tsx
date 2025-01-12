import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { CycleData } from '../../../../utils/periodTracking/types';

interface CycleLengthChartProps {
  cycles: CycleData[];
}

const getTime = (dateString: Date | undefined) => {
  if(!dateString) return new Date().getTime()
  return new Date(dateString).getTime()
}

export default function CycleLengthChart({ cycles }: CycleLengthChartProps) {
  const recentCycles = cycles.slice(-6); // Show last 6 cycles

  const data = {
    labels: recentCycles.map(cycle => format(cycle.startDate, 'MMM d')),
    datasets: [{
      label: 'Cycle Length',
      data: recentCycles.map(cycle => 
        Math.round((getTime(cycle.endDate) - getTime(cycle.startDate)) / (1000 * 60 * 60 * 24))
      ),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y} days`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Days'
        },
        min: 20,
        max: 35
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Length Trends</h3>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}