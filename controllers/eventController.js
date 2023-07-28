const Event = require('../models/eventmodel');
const multer = require('multer');

// Set up the multer middleware to handle image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}, { 'image.data': 0 }); // Exclude image data
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
  const { title, description,category, venue, city, state, country, start_date, end_date, start_time, end_time, ticket_price, ticket_quantity } = req.body;
  const image = req.file; // The uploaded image file

  // Check if the user is an admin
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ error: 'Access denied' });
  // }

  try {
    const newEvent = new Event({
      title,
      description,
      category,
      venue,
      city,
      state,
      country,
      start_date,
      end_date,
      start_time,
      end_time,
      ticket_price,
      ticket_quantity
    });

    // If an image was uploaded, store the image data in the database
    if (image) {
      newEvent.image.data = image.buffer;
      newEvent.image.contentType = image.mimetype;
    }

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create event' });
  }
};

// Update an event (accessible to admins only)
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const updates = { $inc: { ticket_quantity: req.body.ticket_quantity } };



  // Check if the user is an admin
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ error: 'Access denied' });
  // }

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

exports.getEventsbyCategory = async (req,res)=>{
  const { category } = req.params;
  try {
    const event = await Event.find({category:category});
    res.json(events)
  } catch (error) {
    res.status(400).json({ error: 'Failed to get events' });
  }
}

// Delete an event (accessible to admins only)
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  // Check if the user is an admin
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ error: 'Access denied' });
  // }

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
exports.getEventImageById = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (!event || !event.image || !event.image.contentType || !event.image.data) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Set the appropriate content type for the image (assuming it's stored as 'image/jpeg')
    res.set('Content-Type', event.image.contentType);
    res.send(event.image.data);
  } catch (error) {
    console.error('Error retrieving event image:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
};