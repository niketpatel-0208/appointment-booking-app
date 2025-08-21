// client/src/pages/PatientDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const PatientDashboard = () => {
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  const fetchData = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Fetch slots
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      const from = today.toISOString().split('T')[0];
      const to = nextWeek.toISOString().split('T')[0];
      const slotsRes = await api.get(`/slots?from=${from}&to=${to}`);
      setSlots(slotsRes.data);

      // Fetch bookings
      const bookingsRes = await api.get('/my-bookings');
      setMyBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (slotId) => {
    try {
      await api.post('/book', { slotId });
      setMessage(`Successfully booked slot: ${new Date(slotId).toLocaleString()}`);
      fetchData(); // Refresh all data
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to book slot.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Logout
        </button>
      </header>
      
      {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 text-center">{message}</p>}

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Bookings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">My Upcoming Bookings</h2>
          {loading ? <p>Loading...</p> : (
            <ul className="space-y-3">
              {myBookings.length > 0 ? myBookings.map(booking => (
                <li key={booking.id} className="bg-blue-50 p-3 rounded-md text-blue-800 font-medium">
                  {new Date(booking.slot_start_time).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </li>
              )) : <p className="text-gray-500">You have no upcoming bookings.</p>}
            </ul>
          )}
        </div>

        {/* Available Slots Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Available Slots (Next 7 Days)</h2>
          {loading ? <p>Loading...</p> : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {slots.map(slot => (
                <li key={slot.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
                  <span className="text-gray-600">
                    {new Date(slot.start_time).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button onClick={() => handleBooking(slot.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300">
                    Book
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
