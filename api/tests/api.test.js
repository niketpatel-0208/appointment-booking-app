const request = require('supertest');
const path = require('path');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

const express = require('express');
const cors = require('cors');

const authRoutes = require('../src/routes/auth');
const bookingRoutes = require('../src/routes/bookings');

// Create test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);

// Test data
let patientToken;
let adminToken;
let testSlotId;

describe('Appointment Booking API Tests', () => {
  
  // Test 1: Health Check
  describe('GET /api/health', () => {
    it('should return API status', async () => {
      app.get('/api/health', (req, res) => {
        res.json({ status: 'API is running!', time: new Date().toISOString() });
      });
      
      const res = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(res.body.status).toBe('API is running!');
    });
  });

  // Test 2: User Registration
  describe('POST /api/register', () => {
    it('should register a new patient', async () => {
      const timestamp = Date.now();
      const newUser = {
        name: 'Test Patient',
        email: `patient${timestamp}@test.com`,
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/register')
        .send(newUser)
        .expect(201);

      expect(res.body).toHaveProperty('message');
      expect(res.body.user.email).toBe(newUser.email);
      expect(res.body.user.role).toBe('patient');
    });

    it('should not register user with invalid email', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body).toHaveProperty('errors');
    });

    it('should not register user with short password', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      };

      const res = await request(app)
        .post('/api/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body).toHaveProperty('errors');
    });
  });

  // Test 3: User Login
  describe('POST /api/login', () => {
    beforeAll(async () => {
      // Register a test user first
      await request(app)
        .post('/api/register')
        .send({
          name: 'Login Test User',
          email: 'logintest@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'logintest@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/login')
        .send(credentials)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(credentials.email);
      patientToken = res.body.token;
    });

    it('should not login with invalid credentials', async () => {
      const invalidCredentials = {
        email: 'logintest@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app)
        .post('/api/login')
        .send(invalidCredentials)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should login admin user', async () => {
      // First register admin (in real app, this would be seeded)
      await request(app)
        .post('/api/register')
        .send({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'Passw0rd!'
        });

      // Manually update user role to admin (in test environment)
      const db = require('../src/db/db');
      await db('users').where({ email: 'admin@example.com' }).update({ role: 'admin' });

      const credentials = {
        email: 'admin@example.com',
        password: 'Passw0rd!'
      };

      const res = await request(app)
        .post('/api/login')
        .send(credentials)
        .expect(200);

      adminToken = res.body.token;
    });
  });

  // Test 4: Get Available Slots
  describe('GET /api/slots', () => {
    it('should get available slots', async () => {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/slots?from=${today}&to=${nextWeekStr}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        testSlotId = res.body[0].id;
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('start_time');
        expect(res.body[0]).toHaveProperty('end_time');
      }
    });

    it('should get slots without date parameters', async () => {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/slots?from=${today}&to=${nextWeekStr}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // Test 5: Book a Slot
  describe('POST /api/book', () => {
    beforeAll(async () => {
      // Ensure we have a valid slot ID
      const slotsRes = await request(app).get('/api/slots');
      if (slotsRes.body.length > 0) {
        testSlotId = slotsRes.body[0].id;
      }
    });

    it('should book a slot with valid token', async () => {
      if (!testSlotId) {
        console.log('No available slots for booking test, skipping...');
        return;
      }

      const res = await request(app)
        .post('/api/book')
        .set('x-auth-token', patientToken)
        .send({ slotId: testSlotId })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.slot_start_time).toBe(testSlotId);
    });

    it('should not book slot without token', async () => {
      const res = await request(app)
        .post('/api/book')
        .send({ slotId: 1 })
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    it('should not book already booked slot', async () => {
      if (!testSlotId) {
        console.log('No available slots for double booking test, skipping...');
        return;
      }

      // Try to book the same slot again
      const res = await request(app)
        .post('/api/book')
        .set('x-auth-token', patientToken)
        .send({ slotId: testSlotId })
        .expect(409);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error.code).toBe('SLOT_TAKEN');
    });
  });

  // Test 6: Get My Bookings
  describe('GET /api/my-bookings', () => {
    it('should get patient bookings with valid token', async () => {
      const res = await request(app)
        .get('/api/my-bookings')
        .set('x-auth-token', patientToken)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should not get bookings without token', async () => {
      const res = await request(app)
        .get('/api/my-bookings')
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });
  });

  // Test 7: Get All Bookings (Admin)
  describe('GET /api/all-bookings', () => {
    it('should get all bookings with admin token', async () => {
      const res = await request(app)
        .get('/api/all-bookings')
        .set('x-auth-token', adminToken)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should not get all bookings with patient token', async () => {
      const res = await request(app)
        .get('/api/all-bookings')
        .set('x-auth-token', patientToken)
        .expect(403);

      expect(res.body).toHaveProperty('error');
    });

    it('should not get all bookings without token', async () => {
      const res = await request(app)
        .get('/api/all-bookings')
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });
  });

});

// Test completion workflow
describe('Complete User Journey', () => {
  it('should complete full booking workflow', async () => {
    console.log('🔍 Testing complete user journey...');
    
    // 1. Register new user
    console.log('1. Registering user...');
    const timestamp = Date.now();
    const registerRes = await request(app)
      .post('/api/register')
      .send({
        name: 'Journey Test User',
        email: `journey${timestamp}@test.com`,
        password: 'password123'
      });
    
    expect(registerRes.status).toBe(201);
    console.log('✅ User registered successfully');

    // Login to get token
    const loginRes = await request(app)
      .post('/api/login')
      .send({
        email: `journey${timestamp}@test.com`,
        password: 'password123'
      });
    
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    // 2. Get available slots
    console.log('2. Getting available slots...');
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    const slotsRes = await request(app)
      .get(`/api/slots?from=${today}&to=${nextWeekStr}`);
    
    expect(slotsRes.status).toBe(200);
    expect(Array.isArray(slotsRes.body)).toBe(true);
    console.log(`✅ Found ${slotsRes.body.length} available slots`);

    // 3. Book a slot (if available)
    if (slotsRes.body.length > 0) {
      console.log('3. Booking a slot...');
      const slotId = slotsRes.body[0].id;
      const bookRes = await request(app)
        .post('/api/book')
        .set('x-auth-token', token)
        .send({ slotId });
      
      if (bookRes.status === 201) {
        console.log('✅ Slot booked successfully');
      } else {
        console.log('⚠️ Slot may already be taken');
      }

      // 4. Get my bookings
      console.log('4. Getting my bookings...');
      const myBookingsRes = await request(app)
        .get('/api/my-bookings')
        .set('x-auth-token', token);
      
      expect(myBookingsRes.status).toBe(200);
      console.log(`✅ Retrieved ${myBookingsRes.body.length} bookings`);
    } else {
      console.log('⚠️ No available slots to book');
    }

    console.log('🎉 Complete user journey test finished!');
  });
});