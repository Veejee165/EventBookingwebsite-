const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const eventController = require('../controllers/eventController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authenticate');
const emailController = require('../controllers/emailController');
const couponController = require('../controllers/couponController');


// Authentication routes
router.route('/auth/register').post(authController.register);
router.route('/auth/login').post(authController.login);

// Event routes
router.route('/events')
.get(eventController.getAllEvents)
.post(upload.single('image'), eventController.createEvent);

router.route('/events/cat/:category').get(eventController.getEventsbyCategory)

router.route('/events/:id')
  .get(eventController.getEventById)
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);
router.route('/events/image/:eventId').get(eventController.getEventImageById);

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
router.route('/users/all').get(userController.getAllUsers);
router.route('/current-user').get(authMiddleware.authenticate, userController.getCurrentUser);
router.route('/users/find/:email').get(userController.getUserByMail)

//Email routes 
router.route('/email').post(emailController.sendResetEmail);
router.route('/email/order').post(emailController.sendOrderEmail);
router.route('/reset-password').get(authMiddleware.authenticate,userController.updateUser);

//Coupon ROutes
router.route('/coupons').get(couponController.getAllCoupons).post(couponController.createCouponCode);;
router.route('/coupons/:id').get(couponController.getCouponById).delete(couponController.deleteCouponCode);
router.route('/coupons/check-validity').post(couponController.checkCouponValidity);
router.route('/coupons/user-count').post(couponController.updateUserCount);

module.exports = router;