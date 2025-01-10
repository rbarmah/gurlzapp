import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import TherapistBookingModal from './TherapistBookingModal';
import { useAppointmentStore } from '../../../store/appointmentStore';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';

interface TherapistCardProps {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  image: string;
}

export default function TherapistCard(props: TherapistCardProps) {
  const [showModal, setShowModal] = useState(false);
  const addAppointment = useAppointmentStore(state => state.addAppointment);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const handleBook = (data: { date: Date; time: string; situation: string }) => {
    if (!user) {
      navigate('/login');
      return;
    }

    addAppointment({
      therapistId: props.id,
      date: data.date.toISOString().split('T')[0],
      time: data.time,
      userId: user.id,
      status: 'pending'
    });

    setShowModal(false);
    navigate('/mental', { 
      state: { message: 'Appointment booked successfully!' }
    });
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-center space-x-4">
          <img
            src={props.image}
            alt={props.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{props.name}</h3>
            <p className="text-sm text-gray-500">{props.specialty}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="ml-1 text-sm">{props.rating}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm">{props.experience}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm">{props.location}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowModal(true)}>
            Book Session
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <TherapistBookingModal
            therapist={props}
            onClose={() => setShowModal(false)}
            onBook={handleBook}
            availableSlots={{
              [new Date().toISOString().split('T')[0]]: ['09:00', '10:00', '14:00'],
              [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['11:00', '15:00'],
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}