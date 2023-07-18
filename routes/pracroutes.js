const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authenticate');

// Authentication routes
router.route('/auth/register').post(authController.register);
router.route('/auth/login').post(authController.login);

// Event routes
router.route('/events')
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

router.route('/events/:id')
  .get(eventController.getEventById)
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);

// Booking routes
router.route('/bookings')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router.route('/bookings/:id')
  .get(bookingController.getBookingById)
  .put(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router.route('/bookings/user/:userId')
  .get(bookingController.getUserBookings);

// User routes - Admin functionality
router.route('/users/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);
router.route('/current-user').get(authMiddleware.authenticate, userController.getCurrentUser);
router.route('/users/all').get(userController.getAllUsers);
module.exports = router;
