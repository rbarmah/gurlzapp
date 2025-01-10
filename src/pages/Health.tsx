import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen } from 'lucide-react';
import { useHealthStore } from '../store/healthStore';
import Button from '../components/common/Button';
import PeriodCalendar from '../components/health/PeriodCalendar';
import PeriodTracker from '../components/health/PeriodTracker';
import SidePanel from '../components/health/SidePanel';

export default function Health() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'resources'>('analytics');
  const { cycles, logPeriodStart, logPeriodEnd, clearData } = useHealthStore();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleLogPeriod = (date: Date, type: 'start' | 'end') => {
    if (type === 'start') {
      logPeriodStart(date);
    } else {
      logPeriodEnd(date);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-4">Reproductive Health</h1>
            <p className="text-secondary-light/90">Track and understand your cycle</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary" onClick={() => {
              setActiveTab('analytics');
              setShowPanel(true);
            }}>
              <TrendingUp size={20} className="mr-2" />
              Analytics
            </Button>
            <Button variant="secondary" onClick={() => {
              setActiveTab('resources');
              setShowPanel(true);
            }}>
              <BookOpen size={20} className="mr-2" />
              Resources
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <PeriodCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            cycles={cycles}
            onLogPeriod={handleLogPeriod}
          />
        </div>

        {/* Tracker Section */}
        <div>
          <PeriodTracker
            selectedDate={selectedDate}
            cycles={cycles}
          />
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}