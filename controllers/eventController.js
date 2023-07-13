const Event = require('../models/eventmodel');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve event' });
  }
};
// Create a new event (accessible to admins only)
exports.createEvent = async (req, res) => {
  const { title, description, venue, start_date, end_date, start_time, end_time, ticket_price, ticket_quantity } = req.body;

  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const event = await Event.create({
      title,
      description,
      venue,
      start_date,
      end_date,
      start_time,
      end_time,
      ticket_price,
      ticket_quantity
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create event' });
  }
};

// Update an event (accessible to admins only)
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const event = await Event.findByIdAndUpdate(id, updates, { new: true });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update event' });
  }
};

// Delete an event (accessible to admins only)
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete event' });
  }
};
