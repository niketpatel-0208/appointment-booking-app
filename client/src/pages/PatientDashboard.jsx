import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, LogOut, CheckCircle, Plus, ChevronRight, ChevronDown, MapPin, Stethoscope, Hash, AlertCircle } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import Logo from '../components/Logo';

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
  gap: 1.25rem;
  max-height: 450px;
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
  padding: 1.25rem;
  border-radius: 16px;
  color: ${props => props.textColor || '#1e40af'};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  overflow: visible;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.accentColor || '#3b82f6'};
    border-radius: 0 0 0 16px;
  }
`;

const BookingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BookingMainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BookingContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AppointmentDate = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.color || '#1e40af'};
  line-height: 1.2;
`;

const AppointmentTime = styled.div`
  font-size: 0.9rem;
  color: ${props => props.color || '#64748b'};
  font-weight: 500;
`;

const AppointmentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.color || '#64748b'};
  opacity: 0.8;
`;

const BookingStatus = styled.span`
  background: ${props => props.bgColor || '#dbeafe'};
  color: ${props => props.textColor || '#1e40af'};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BookingDateTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.color || '#1e40af'};
`;

const BookingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const BookingId = styled.div`
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.8rem;
  color: ${props => props.color || '#64748b'};
`;

const AppointmentTypeIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.bgColor || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  flex-shrink: 0;
`;

const SlotsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
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

const DateGroup = styled(motion.div)`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DateHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: ${props => props.isExpanded ? '1rem' : '0'};
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  
  &:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-color: #cbd5e0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const DateIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
`;

const DateText = styled.div``;

const DateDay = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
`;

const DateInfo = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }
`;

const SlotCard = styled(motion.div)`
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #059669, #10b981);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }
  
  &:hover {
    border-color: #10b981;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
    transform: translateY(-2px);
    
    &:before {
      transform: scaleX(1);
    }
  }
`;

const SlotTime = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const SlotPeriod = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
`;

const QuickBookButton = styled(motion.div)`
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  
  ${SlotCard}:hover & {
    opacity: 1;
  }
`;

const SlotsBadge = styled.span`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: auto;
`;

const ExpandIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  color: #64748b;
  transition: color 0.2s ease;
  
  ${DateHeader}:hover & {
    color: #475569;
  }
`;

const SlotsContainer = styled(motion.div)`
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px dashed #cbd5e0;
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
  const [expandedDates, setExpandedDates] = useState(new Set());
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
      setMessage(`Appointment booked successfully!`);
      fetchData(); // Refresh all data
      // Clear success message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(error.response?.data?.error?.message || 'Failed to book slot.');
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const toggleDateExpansion = (dateKey) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  // Group slots by date
  const groupSlotsByDate = (slots) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return slots.reduce((groups, slot) => {
      const slotDate = new Date(slot.start_time);
      const dateKey = slotDate.toISOString().split('T')[0];

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: slotDate,
          slots: []
        };
      }

      groups[dateKey].slots.push(slot);
      return groups;
    }, {});
  };

  const formatTimeSlot = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAppointmentStatus = (booking) => {
    const now = new Date();
    const appointmentDate = new Date(booking.slot_start_time);

    if (appointmentDate < now) {
      return {
        label: 'Completed',
        bgColor: '#d1fae5',
        textColor: '#065f46',
        accentColor: '#10b981'
      };
    } else if (appointmentDate.toDateString() === now.toDateString()) {
      return {
        label: 'Today',
        bgColor: '#fef3c7',
        textColor: '#92400e',
        accentColor: '#f59e0b'
      };
    } else {
      return {
        label: 'Upcoming',
        bgColor: '#dbeafe',
        textColor: '#1e40af',
        accentColor: '#3b82f6'
      };
    }
  };

  const formatAppointmentDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    let dayLabel;
    if (date.toDateString() === today.toDateString()) {
      dayLabel = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dayLabel = 'Tomorrow';
    } else {
      dayLabel = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return { dayLabel, time, fullDate: date };
  };

  const getTimeOfDay = (date) => {
    const hour = date.getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const formatDateHeader = (date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return {
        day: 'Today',
        info: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      };
    } else if (isTomorrow) {
      return {
        day: 'Tomorrow',
        info: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      };
    } else {
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        info: date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      };
    }
  };

  const groupedSlots = groupSlotsByDate(slots);

  useEffect(() => {
    fetchData();

    // Auto-expand today's date by default
    const today = new Date().toISOString().split('T')[0];
    setExpandedDates(new Set([today]));
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
          <Logo size="50px" fontSize="1.6rem" color="#1a202c" />
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
                myBookings.map((booking, index) => {
                  const status = getAppointmentStatus(booking);
                  const { dayLabel, time } = formatAppointmentDateTime(booking.slot_start_time);

                  return (
                    <BookingItem
                      key={booking.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      bgColor={status.bgColor}
                      borderColor={status.accentColor + '40'}
                      textColor={status.textColor}
                      accentColor={status.accentColor}
                    >
                      <BookingHeader>
                        <BookingMainInfo>
                          <AppointmentTypeIcon bgColor={`linear-gradient(135deg, ${status.accentColor} 0%, ${status.accentColor}dd 100%)`}>
                            <Stethoscope color="white" size={20} />
                          </AppointmentTypeIcon>
                          <BookingContent>
                            <AppointmentDate color={status.accentColor}>
                              {dayLabel}
                            </AppointmentDate>
                            <AppointmentTime color={status.textColor}>
                              {time}
                            </AppointmentTime>
                          </BookingContent>
                        </BookingMainInfo>
                        <div style={{ textAlign: 'right' }}>
                          <BookingStatus
                            bgColor={status.accentColor + '20'}
                            textColor={status.accentColor}
                          >
                            {status.label}
                          </BookingStatus>
                          <BookingId color={status.textColor} style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
                            #{booking.id.toString().padStart(3, '0')}
                          </BookingId>
                        </div>
                      </BookingHeader>

                      <AppointmentDetails>
                        <DetailItem color={status.textColor}>
                          <MapPin size={14} color={status.accentColor} />
                          <span>HealthCare Medical Center</span>
                        </DetailItem>
                        <DetailItem color={status.textColor}>
                          <User size={14} color={status.accentColor} />
                          <span>General Health Consultation</span>
                        </DetailItem>
                      </AppointmentDetails>
                    </BookingItem>
                  );
                })
              ) : (
                <EmptyState>
                  <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>
                    No upcoming appointments scheduled
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    Book an appointment from the available slots below
                  </div>
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
            <CardTitle>Available Appointments</CardTitle>
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
              {Object.keys(groupedSlots).length > 0 ? (
                Object.entries(groupedSlots)
                  .sort(([a], [b]) => new Date(a) - new Date(b))
                  .map(([dateKey, { date, slots: dateSlots }], groupIndex) => {
                    const { day, info } = formatDateHeader(date);
                    const isExpanded = expandedDates.has(dateKey);
                    const isToday = new Date().toDateString() === date.toDateString();

                    return (
                      <DateGroup
                        key={dateKey}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                      >
                        <DateHeader
                          onClick={() => toggleDateExpansion(dateKey)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          isExpanded={isExpanded}
                        >
                          <DateIcon>
                            <Calendar color="white" size={16} />
                          </DateIcon>
                          <DateText>
                            <DateDay>{day}</DateDay>
                            <DateInfo>{info}</DateInfo>
                          </DateText>
                          <SlotsBadge>
                            {dateSlots.length} slot{dateSlots.length !== 1 ? 's' : ''}
                          </SlotsBadge>
                          <ExpandIcon
                            animate={{
                              rotate: isExpanded ? 90 : 0
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight size={16} />
                          </ExpandIcon>
                        </DateHeader>

                        <AnimatePresence>
                          {isExpanded && (
                            <SlotsContainer
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <SlotsGrid>
                                {dateSlots.map((slot, slotIndex) => {
                                  const slotDate = new Date(slot.start_time);
                                  const timeString = formatTimeSlot(slotDate);
                                  const period = getTimeOfDay(slotDate);

                                  return (
                                    <SlotCard
                                      key={slot.id}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: slotIndex * 0.05
                                      }}
                                      whileHover={{
                                        scale: 1.05,
                                        rotateY: 5
                                      }}
                                      onClick={() => handleBooking(slot.id)}
                                    >
                                      <SlotTime>{timeString}</SlotTime>
                                      <SlotPeriod>{period}</SlotPeriod>
                                      <QuickBookButton
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Plus size={14} />
                                        Book Now
                                      </QuickBookButton>
                                    </SlotCard>
                                  );
                                })}
                              </SlotsGrid>
                            </SlotsContainer>
                          )}
                        </AnimatePresence>
                      </DateGroup>
                    );
                  })
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
