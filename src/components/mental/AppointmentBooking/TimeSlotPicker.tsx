import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}

export default function TimeSlotPicker({
  slots,
  selectedSlot,
  onSlotSelect
}: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <motion.button
          key={slot}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSlotSelect(slot)}
          className={`p-3 rounded-lg text-center transition-colors
            ${selectedSlot === slot
              ? 'bg-primary text-white'
              : 'bg-gray-50 hover:bg-gray-100'
            }`}
        >
          {format(new Date(`2000-01-01 ${slot}`), 'h:mm a')}
        </motion.button>
      ))}
    </div>
  );
}