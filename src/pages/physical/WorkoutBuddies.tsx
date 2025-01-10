import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal'; // Assuming a Modal component is available

export default function WorkoutBuddies() {
  const navigate = useNavigate();
  const [buddies, setBuddies] = useState([]); // Dynamic list of buddies
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isUserInList, setIsUserInList] = useState(false); // Track if the user is in the buddy list
  const [newBuddy, setNewBuddy] = useState({
    name: '',
    location: '',
    interests: '',
    availability: 'Mornings',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBuddy((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBuddy = () => {
    const interestsArray = newBuddy.interests.split(',').map((item) => item.trim());
    setBuddies((prev) => [
      ...prev,
      { ...newBuddy, id: 'user', interests: interestsArray, level: 'Beginner' },
    ]);
    setIsUserInList(true);
    setShowPopup(false);
  };

  const handleRemoveBuddy = () => {
    setBuddies((prev) => prev.filter((buddy) => buddy.id !== 'user'));
    setIsUserInList(false);
  };

  const filteredBuddies = buddies.filter((buddy) =>
    buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.interests.some((interest) =>
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/physical')}
            className="mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Physical
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/my-buddies')}
            className="mb-4"
          >
            My Buddies
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Find Workout Buddies</h1>
        <p className="text-secondary-light/90">Connect with fitness enthusiasts near you</p>
        {!isUserInList ? (
          <Button onClick={() => setShowPopup(true)} variant="secondary" className="mt-4">
            Add Yourself as a Buddy
          </Button>
        ) : (
          <Button onClick={handleRemoveBuddy} variant="secondary" className="mt-4">
            Remove Yourself from Buddy List
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, interests, or location..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Buddy List */}
        <div className="space-y-4">
          {filteredBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className="flex items-center space-x-4 p-4 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-colors"
            >
              <img
                src="https://via.placeholder.com/100" // Replace with dynamic images if available
                alt={buddy.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{buddy.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={16} className="mr-1" />
                  {buddy.location}
                  <span className="mx-2">•</span>
                  <Calendar size={16} className="mr-1" />
                  {buddy.availability}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {buddy.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <Button>Connect</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Buddy Popup */}
      {showPopup && (
        <Modal onClose={() => setShowPopup(false)}>
          <h3 className="text-lg font-semibold mb-4">Add Yourself as a Workout Buddy</h3>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={newBuddy.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              value={newBuddy.location}
              onChange={handleInputChange}
              placeholder="Your Location"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="interests"
              value={newBuddy.interests}
              onChange={handleInputChange}
              placeholder="Your Interests (comma-separated)"
              className="w-full p-2 border rounded"
            />
            <select
              name="availability"
              value={newBuddy.availability}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="Mornings">Mornings</option>
              <option value="Afternoons">Afternoons</option>
              <option value="Evenings">Evenings</option>
            </select>
            <Button onClick={handleAddBuddy}>Add Buddy</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
