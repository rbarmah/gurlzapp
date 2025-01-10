import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MentalDashboard from '../components/mental/MentalDashboard';
import WellnessVideo from '../components/mental/WellnessVideo';
import MoodTracker from '../components/mental/MoodTracker';
import BreathingExercise from '../components/mental/BreathingExercise';
import WellnessResources from '../components/mental/WellnessResources';
import WellnessQuiz from '../components/mental/WellnessQuiz';
import AppointmentBooking from '../components/mental/AppointmentBooking';

export default function Mental() {
  return (
    <Routes>
      <Route index element={<MentalDashboard />} />
      <Route path="video" element={<WellnessVideo />} />
      <Route path="mood" element={<MoodTracker />} />
      <Route path="breathing" element={<BreathingExercise />} />
      <Route path="resources" element={<WellnessResources />} />
      <Route path="quiz" element={<WellnessQuiz />} />
      <Route path="appointment" element={<AppointmentBooking />} />
    </Routes>
  );
}