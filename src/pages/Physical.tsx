import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PhysicalDashboard from './physical/PhysicalDashboard';
import FitnessAssessment from '../components/physical/fitness/FitnessAssessment';
import WorkoutBuddies from './physical/WorkoutBuddies';
import ExerciseTracking from './physical/ExerciseTracking';
import GoalSetting from './physical/GoalSetting';
import WorkoutSchedule from './physical/WorkoutSchedule';

export default function Physical() {
  return (
    <Routes>
      <Route index element={<PhysicalDashboard />} />
      <Route path="fitness-assessment" element={<FitnessAssessment />} />
      <Route path="workout-buddies" element={<WorkoutBuddies />} />
      <Route path="exercise" element={<ExerciseTracking />} />
      <Route path="goals" element={<GoalSetting />} />
      <Route path="schedule" element={<WorkoutSchedule />} />
    </Routes>
  );
}