import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../common/Button';

interface Goal {
  id: string;
  title: string;
  target: string;
  progress: number;
  deadline: string;
}

export default function GoalSettingSection() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      ...formData,
      progress: 0
    };
    setGoals(prev => [...prev, newGoal]);
    setFormData({ title: '', target: '', deadline: '' });
    setShowForm(false);
  };

  const updateProgress = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { ...goal, progress } : goal
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary flex items-center">
          <Target className="mr-2" />
          Fitness Goals
        </h3>
        <Button onClick={() => setShowForm(true)} variant="outline" size="sm">
          <Plus size={16} className="mr-1" />
          Add Goal
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target
                </label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowForm(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">
                Add Goal
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div 
            key={goal.id}
            className="bg-secondary/10 rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <p className="text-sm text-gray-500">Target: {goal.target}</p>
              </div>
              <span className="text-sm text-gray-500">
                Due {new Date(goal.deadline).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="text-primary font-medium">{goal.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <input
                type="range"
                value={goal.progress}
                onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                min="0"
                max="100"
                className="w-full mt-2"
              />
            </div>
          </div>
        ))}

        {goals.length === 0 && !showForm && (
          <div className="text-center py-8 text-gray-500">
            No goals set yet. Click "Add Goal" to get started!
          </div>
        )}
      </div>
    </div>
  );
}