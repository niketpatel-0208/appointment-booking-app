// api/src/controllers/bookingController.js
const db = require('../db/db');

// --- Slot Generation Logic ---
const getAvailableSlots = async (from, to) => {
    const clinicStartTime = 9; // 9:00 AM
    const clinicEndTime = 17; // 5:00 PM
    const slotDurationMinutes = 30;

    // Get all existing bookings within the date range
    const existingBookings = await db('bookings')
        .where('slot_start_time', '>=', from.toISOString())
        .where('slot_start_time', '<', to.toISOString())
        .select('slot_start_time');

    const bookedSlots = new Set(existingBookings.map(b => b.slot_start_time));

    const availableSlots = [];
    let currentDate = new Date(from);

    while (currentDate < to) {
        // Set time to the start of the clinic day for the current date
        let slotTime = new Date(currentDate);
        slotTime.setUTCHours(clinicStartTime, 0, 0, 0);

        const endOfDay = new Date(currentDate);
        endOfDay.setUTCHours(clinicEndTime, 0, 0, 0);

        // Generate slots for the day
        while (slotTime < endOfDay) {
            const slotISO = slotTime.toISOString();
            if (!bookedSlots.has(slotISO)) {
                availableSlots.push({
                    id: slotISO, // Use the ISO string as a unique ID for the slot
                    start_time: slotISO,
                    end_time: new Date(slotTime.getTime() + slotDurationMinutes * 60000).toISOString()
                });
            }
            // Move to the next slot
            slotTime.setMinutes(slotTime.getMinutes() + slotDurationMinutes);
        }
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return availableSlots;
};


// --- Controller Functions ---

exports.getSlots = async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ error: { message: 'Both "from" and "to" query parameters are required.' } });
    }

    try {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        
        // Basic validation
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
             return res.status(400).json({ error: { message: 'Invalid date format.' } });
        }

        const slots = await getAvailableSlots(fromDate, toDate);
        res.json(slots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.bookSlot = async (req, res) => {
    const { slotId } = req.body; // slotId is the ISO string of the start time
    const userId = req.user.id;

    if (!slotId) {
        return res.status(400).json({ error: { message: 'slotId is required.' } });
    }
    
    try {
        // The UNIQUE constraint on the 'slot_start_time' column handles the race condition.
        // If two requests try to book the same slot simultaneously, the database will reject
        // the second one with a unique constraint violation error.
        const [newBooking] = await db('bookings')
            .insert({
                user_id: userId,
                slot_start_time: slotId
            })
            .returning('*');

        res.status(201).json(newBooking);

    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') { // Specific to SQLite for unique constraint violation
            return res.status(409).json({ error: { code: 'SLOT_TAKEN', message: 'This time slot is no longer available.' } });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await db('bookings')
            .where({ user_id: req.user.id })
            .orderBy('slot_start_time', 'asc');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        // Join with users table to get patient name and email
        const bookings = await db('bookings')
            .join('users', 'bookings.user_id', '=', 'users.id')
            .select(
                'bookings.id',
                'bookings.slot_start_time',
                'bookings.created_at',
                'users.name as patient_name',
                'users.email as patient_email'
            )
            .orderBy('bookings.slot_start_time', 'asc');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
