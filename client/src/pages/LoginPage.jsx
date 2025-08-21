import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Heart } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Container = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fff;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 1;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #f87171;
  color: #dc2626;
  padding: 0.875rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #64748b;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
  
  &:hover {
    color: #7c3aed;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 20px;
  margin-bottom: 1rem;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Header>
          <LogoIcon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Heart color="white" size={28} />
          </LogoIcon>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your HealthCare account</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <IconWrapper>
                <Mail size={20} />
              </IconWrapper>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <IconWrapper>
                <Lock size={20} />
              </IconWrapper>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputWrapper>
          </InputGroup>

          {error && (
            <ErrorMessage
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}

          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn size={20} />
            Sign In
          </Button>
        </Form>

        <Footer>
          Don't have an account?{' '}
          <StyledLink to="/register">Create one here</StyledLink>
        </Footer>
      </Card>
    </Container>
  );
};

export default LoginPage;
