import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data
const cycleData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Cycle Length',
      data: [28, 30, 27, 29, 28],
      borderColor: 'rgb(255, 75, 145)',
      backgroundColor: 'rgba(255, 75, 145, 0.5)',
    }
  ]
};

const periodData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Period Length',
      data: [5, 6, 5, 4, 5],
      backgroundColor: 'rgba(255, 75, 145, 0.8)',
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
};

export default function InsightsSection() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-primary mb-6">Cycle Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="font-medium text-gray-700">Cycle Length Trends</h4>
          <Line data={cycleData} options={options} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h4 className="font-medium text-gray-700">Period Duration</h4>
          <Bar data={periodData} options={options} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-secondary/10 rounded-lg"
      >
        <h4 className="font-medium text-primary mb-2">Summary</h4>
        <p className="text-sm text-gray-600">
          Your average cycle length is 28.4 days with a period duration of 5 days.
          Your cycle has been relatively regular over the past 5 months.
        </p>
      </motion.div>
    </div>
  );
}