// client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await api.get('/all-bookings');
        setAllBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Logout
        </button>
      </header>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">All System Bookings</h2>
        {loading && <p>Loading all bookings...</p>}
        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Email</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allBookings.length > 0 ? allBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 whitespace-nowrap">{booking.patient_name}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{booking.patient_email}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{new Date(booking.slot_start_time).toLocaleString()}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{booking.id}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">No bookings found in the system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
