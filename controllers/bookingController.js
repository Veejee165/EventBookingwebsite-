const Booking = require('../models/bookingmodel');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve booking' });
  }
};

// Get all bookings for a specific user
exports.getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ user: userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user bookings' });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  const { user, event, quantity } = req.body;
  try {
  
    const booking = await Booking.create({ user, event, quantity });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create booking' });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(id, updates, { new: true });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update booking' });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete booking' });
  }
};
