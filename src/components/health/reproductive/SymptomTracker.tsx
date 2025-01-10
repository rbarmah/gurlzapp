import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { symptoms } from './constants';
import Button from '../../common/Button';

export default function SymptomTracker() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const SymptomModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-primary">How are you feeling today?</h3>
          <button 
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {symptoms.map((category, idx) => (
          <div key={idx} className="mb-6">
            <h4 className="text-lg font-semibold mb-3">{category.category}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {category.items.map((symptom, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedSymptoms(prev => 
                      prev.includes(symptom) 
                        ? prev.filter(s => s !== symptom)
                        : [...prev, symptom]
                    );
                  }}
                  className={`p-3 rounded-lg text-sm transition-all
                    ${selectedSymptoms.includes(symptom) 
                      ? 'bg-primary text-white' 
                      : 'bg-secondary/10 text-gray-700 hover:bg-secondary/20'
                    }`}
                >
                  {symptom}
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button onClick={() => setShowModal(false)}>
            Save Symptoms
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary">How are you feeling today?</h3>
        <Button onClick={() => setShowModal(true)}>
          Log Symptoms
        </Button>
      </div>

      {selectedSymptoms.length > 0 ? (
        <div className="bg-secondary/10 rounded-lg p-4">
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom, idx) => (
              <span 
                key={idx}
                className="bg-white px-3 py-1 rounded-full text-sm text-primary"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          No symptoms logged for today. Click "Log Symptoms" to track how you're feeling.
        </p>
      )}

      <AnimatePresence>
        {showModal && <SymptomModal />}
      </AnimatePresence>
    </div>
  );
}