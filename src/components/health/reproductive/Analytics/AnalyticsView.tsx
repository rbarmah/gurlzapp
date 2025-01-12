import React from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsView() {
  // Mock data for testing purposes
  const cycles = [
    {
      startDate: '2024-01-01',
      endDate: '2024-01-06',
      length: 28,
    },
    {
      startDate: '2024-01-29',
      endDate: '2024-02-03',
      length: 30,
    },
    {
      startDate: '2024-02-28',
      endDate: '2024-03-04',
      length: 27,
    },
  ];

  // Calculate Monthly Cycle Lengths
  const monthlyCycleLengths = cycles.reduce((acc, cycle) => {
    const startDate = new Date(cycle.startDate);
    const month = `${startDate.getFullYear()}-${startDate.getMonth() + 1}`;
    if (!acc[month]) acc[month] = [];
    acc[month].push(cycle.length);
    return acc;
  }, {});

  const avgMonthlyCycleLengths = Object.keys(monthlyCycleLengths).map((month) => ({
    month,
    avgCycleLength:
      monthlyCycleLengths[month].reduce((a, b) => a + b, 0) /
      monthlyCycleLengths[month].length,
  }));

  // Calculate Monthly Period Lengths
  const monthlyPeriodLengths = cycles.reduce((acc, cycle) => {
    const startDate = new Date(cycle.startDate);
    const month = `${startDate.getFullYear()}-${startDate.getMonth() + 1}`;
    const periodLength =
      Math.abs(new Date(cycle.endDate).getDate() - new Date(cycle.startDate).getDate()) + 1;
    if (!acc[month]) acc[month] = [];
    acc[month].push(periodLength);
    return acc;
  }, {});

  const avgMonthlyPeriodLengths = Object.keys(monthlyPeriodLengths).map((month) => ({
    month,
    avgPeriodLength:
      monthlyPeriodLengths[month].reduce((a, b) => a + b, 0) /
      monthlyPeriodLengths[month].length,
  }));

  const renderPipeChart = (data, label) => (
    <div className="bg-white rounded-xl p-6">
      <h4 className="text-lg font-bold mb-4">{label}</h4>
      <div className="flex space-x-4 overflow-x-auto">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative h-40 w-8 bg-gray-100 rounded-xl overflow-hidden">
              <div
                className="absolute bottom-0 w-full bg-teal-500"
                style={{ height: `${(item.value / 50) * 100}%` }}
              ></div>
            </div>
            <span className="mt-2 text-xs text-gray-500">{item.label}</span>
            <span className="text-sm font-bold text-gray-700">{item.value} days</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6"
        >
          <h4 className="text-sm text-gray-500 mb-1">Tracked Cycles</h4>
          <p className="text-2xl font-bold text-teal-600">{cycles.length}</p>
        </motion.div>
      </div>

      {/* Pipe Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPipeChart(
          avgMonthlyCycleLengths.map((item) => ({ label: item.month, value: Math.round(item.avgCycleLength) })),
          'Monthly Cycle Lengths'
        )}
        {renderPipeChart(
          avgMonthlyPeriodLengths.map((item) => ({ label: item.month, value: Math.round(item.avgPeriodLength) })),
          'Monthly Period Lengths'
        )}
      </div>
    </div>
  );
}
