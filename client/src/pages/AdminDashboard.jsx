import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield, LogOut, Users, Calendar, Mail, Clock, Hash } from 'lucide-react';
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

const AdminSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AdminBadge = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);
`;

const AdminText = styled.div``;

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
  margin-bottom: 2rem;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const TableHeaderRow = styled.tr``;

const TableHeader = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
  
  &:first-child {
    border-top-left-radius: 16px;
  }
  
  &:last-child {
    border-top-right-radius: 16px;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled(motion.tr)`
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  color: #374151;
  font-weight: 500;
  
  &.email {
    color: #6366f1;
    font-weight: 400;
  }
  
  &.id {
    color: #64748b;
    font-size: 0.875rem;
    font-family: 'Monaco', 'Menlo', monospace;
  }
`;

const IconCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CellIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.bgColor || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  font-style: italic;
  padding: 3rem 1rem;
  background: #f8fafc;
`;

const LoadingSpinner = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #64748b;
  font-weight: 500;
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #f87171;
  color: #dc2626;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

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
        <AdminSection>
          <AdminBadge>
            <Shield color="white" size={24} />
          </AdminBadge>
          <AdminText>
            <Title>Admin Dashboard</Title>
            <Subtitle>Manage all system appointments</Subtitle>
          </AdminText>
        </AdminSection>

        <LogoutButton
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={18} />
          Logout
        </LogoutButton>
      </Header>

      <Card
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <CardHeader>
          <CardIcon>
            <Users color="white" size={20} />
          </CardIcon>
          <CardTitle>All System Bookings ({allBookings.length})</CardTitle>
        </CardHeader>

        {loading && (
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            Loading all bookings...
          </LoadingSpinner>
        )}

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}

        {!loading && !error && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableHeaderRow>
                  <TableHeader>Patient</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Appointment</TableHeader>
                  <TableHeader>Booking ID</TableHeader>
                </TableHeaderRow>
              </TableHead>
              <TableBody>
                {allBookings.length > 0 ? (
                  allBookings.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <TableCell>
                        <IconCell>
                          <CellIcon bgColor="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)">
                            <Users color="white" size={16} />
                          </CellIcon>
                          {booking.patient_name}
                        </IconCell>
                      </TableCell>
                      <TableCell className="email">
                        <IconCell>
                          <CellIcon bgColor="linear-gradient(135deg, #059669 0%, #10b981 100%)">
                            <Mail color="white" size={16} />
                          </CellIcon>
                          {booking.patient_email}
                        </IconCell>
                      </TableCell>
                      <TableCell>
                        <IconCell>
                          <CellIcon bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                            <Clock color="white" size={16} />
                          </CellIcon>
                          {new Date(booking.slot_start_time).toLocaleString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </IconCell>
                      </TableCell>
                      <TableCell className="id">
                        <IconCell>
                          <CellIcon bgColor="linear-gradient(135deg, #64748b 0%, #475569 100%)">
                            <Hash color="white" size={16} />
                          </CellIcon>
                          #{booking.id}
                        </IconCell>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4">
                      <EmptyState>
                        No bookings found in the system
                      </EmptyState>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Container>
  );
};

export default AdminDashboard;
