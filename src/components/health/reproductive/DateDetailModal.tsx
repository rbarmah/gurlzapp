import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import Button from '../../common/Button';

interface DateDetailModalProps {
  date: Date;
  prediction: any;
  onClose: () => void;
  onLogPeriod: (type: 'start' | 'end') => void;
  onLogSymptoms: () => void;
}

export default function DateDetailModal({
  date,
  prediction,
  onClose,
  onLogPeriod,
  onLogSymptoms
}: DateDetailModalProps) {
  // Prevent clicks inside modal from bubbling up
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={handleModalClick} // Stop propagation here
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-primary">
            {format(date, 'MMMM d, yyyy')}
          </h3>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600" size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Day Status */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-lg font-medium text-primary">
              {prediction?.details || 'No prediction available'}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => onLogPeriod('start')}
              className="w-full"
              variant="outline"
            >
              Log Period Start
            </Button>
            <Button
              onClick={() => onLogPeriod('end')}
              className="w-full"
              variant="outline"
            >
              Log Period End
            </Button>
            <Button
              onClick={onLogSymptoms}
              className="w-full"
            >
              Log Symptoms & Data
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}