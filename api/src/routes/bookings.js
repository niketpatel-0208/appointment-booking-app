// api/src/routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @route   GET /api/slots
// @desc    Get available slots for a date range
// @access  Public
router.get('/slots', bookingController.getSlots);

// @route   POST /api/book
// @desc    Book a slot
// @access  Private (Patient)
router.post('/book', protect, bookingController.bookSlot);

// @route   GET /api/my-bookings
// @desc    Get bookings for the logged-in user
// @access  Private (Patient)
router.get('/my-bookings', protect, bookingController.getMyBookings);

// @route   GET /api/all-bookings
// @desc    Get all bookings in the system
// @access  Private (Admin)
router.get('/all-bookings', protect, isAdmin, bookingController.getAllBookings);


module.exports = router;
