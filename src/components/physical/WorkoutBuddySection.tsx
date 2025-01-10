import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

export default function WorkoutBuddySection() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    time: 'morning',
    workout: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save user details to the workout buddy list
    console.log('Form Data:', formData);
    setShowPopup(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary flex items-center">
          <Users className="mr-2" />
          Workout Buddies
        </h3>
      </div>

      <div className="text-center py-8 space-y-4">
        <p className="text-gray-600">
          Find workout partners near you and stay motivated together!
        </p>
        <Button onClick={() => navigate('/physical/workout-buddies')}>
          Find Workout Buddy
        </Button>
        <Button variant="secondary" onClick={() => setShowPopup(true)}>
          Want to Be a Buddy
        </Button>
      </div>

      {showPopup && (
        <Modal onClose={() => setShowPopup(false)}>
          <h3 className="text-lg font-semibold mb-4">Share Your Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Your Location (Community)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="E.g., Downtown, Eastside"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Available Time
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            <div>
              <label htmlFor="workout" className="block text-sm font-medium text-gray-700">
                Preferred Workout
              </label>
              <input
                type="text"
                id="workout"
                name="workout"
                value={formData.workout}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="E.g., Yoga, Cardio, Weightlifting"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="secondary" onClick={() => setShowPopup(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
