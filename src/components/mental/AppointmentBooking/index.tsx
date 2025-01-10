import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../common/Button';
import TherapistCard from './TherapistCard';

// Demo therapists data
const therapists = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Anxiety & Depression',
    rating: 4.9,
    experience: '10 yrs',
    location: 'Downtown',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Stress Management',
    rating: 4.8,
    experience: '8 yrs',
    location: 'Westside',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200'
  },
  {
    id: '3',
    name: 'Dr. Emily Parker',
    specialty: 'Relationship Counseling',
    rating: 4.9,
    experience: '12 yrs',
    location: 'Eastside',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200'
  }
];

export default function AppointmentBooking() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/mental')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Mental Wellness
        </Button>
        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-secondary-light/90">Connect with mental health professionals</p>
      </div>

      {/* Therapist List */}
      <div className="grid grid-cols-1 gap-6">
        {therapists.map((therapist) => (
          <TherapistCard
            key={therapist.id}
            {...therapist}
          />
        ))}
      </div>
    </div>
  );
}