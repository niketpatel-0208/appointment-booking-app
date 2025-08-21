import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, LogOut, CheckCircle, Plus } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Container = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Header = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1.5rem 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    text-align: center;
  }
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
`;

const WelcomeText = styled.div``;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
`;

const LogoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #22c55e;
  color: #15803d;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.bgColor || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px ${props => props.shadowColor || 'rgba(79, 70, 229, 0.3)'};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }
`;

const BookingItem = styled(motion.div)`
  background: ${props => props.bgColor || 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'};
  border: 1px solid ${props => props.borderColor || '#93c5fd'};
  padding: 1rem;
  border-radius: 12px;
  color: ${props => props.textColor || '#1e40af'};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SlotsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

const SlotItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const SlotTime = styled.span`
  color: #475569;
  font-weight: 500;
  font-size: 0.9rem;
`;

const BookButton = styled(motion.button)`
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  font-style: italic;
  padding: 2rem 0;
`;

const LoadingSpinner = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #64748b;
`;

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
      // Clear success message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to book slot.');
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <WelcomeSection>
          <Avatar>
            <User color="white" size={24} />
          </Avatar>
          <WelcomeText>
            <Title>Welcome back, {user?.name}!</Title>
            <Subtitle>Manage your appointments with ease</Subtitle>
          </WelcomeText>
        </WelcomeSection>

        <LogoutButton
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={18} />
          Logout
        </LogoutButton>
      </Header>

      <AnimatePresence>
        {message && (
          <SuccessMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle size={20} />
            {message}
          </SuccessMessage>
        )}
      </AnimatePresence>

      <Grid>
        <Card
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CardHeader>
            <CardIcon
              bgColor="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
              shadowColor="rgba(59, 130, 246, 0.3)"
            >
              <Calendar color="white" size={20} />
            </CardIcon>
            <CardTitle>My Upcoming Appointments</CardTitle>
          </CardHeader>

          {loading ? (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              Loading appointments...
            </LoadingSpinner>
          ) : (
            <BookingsList>
              {myBookings.length > 0 ? (
                myBookings.map(booking => (
                  <BookingItem
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    bgColor="linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
                    borderColor="#93c5fd"
                    textColor="#1e40af"
                  >
                    <Clock size={18} />
                    {new Date(booking.slot_start_time).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </BookingItem>
                ))
              ) : (
                <EmptyState>
                  No upcoming appointments scheduled
                </EmptyState>
              )}
            </BookingsList>
          )}
        </Card>

        <Card
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CardHeader>
            <CardIcon
              bgColor="linear-gradient(135deg, #059669 0%, #10b981 100%)"
              shadowColor="rgba(5, 150, 105, 0.3)"
            >
              <Plus color="white" size={20} />
            </CardIcon>
            <CardTitle>Available Slots (Next 7 Days)</CardTitle>
          </CardHeader>

          {loading ? (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              Loading available slots...
            </LoadingSpinner>
          ) : (
            <SlotsList>
              {slots.length > 0 ? (
                slots.map(slot => (
                  <SlotItem
                    key={slot.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <SlotTime>
                      {new Date(slot.start_time).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </SlotTime>
                    <BookButton
                      onClick={() => handleBooking(slot.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={16} />
                      Book
                    </BookButton>
                  </SlotItem>
                ))
              ) : (
                <EmptyState>
                  No available slots in the next 7 days
                </EmptyState>
              )}
            </SlotsList>
          )}
        </Card>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;
