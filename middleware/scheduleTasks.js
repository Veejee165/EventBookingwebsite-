const cron = require("node-cron");
const emailController = require("../controllers/emailController");
const eventController = require("../controllers/eventController");
const bookingController = require("../controllers/bookingController");
const userController = require("../controllers/userController");

cron.schedule("0 8 * * *", async () => {
	console.log("called");
	// This function will run every day at midnight
	try {
		// Step 1: Get events happening one day from now
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const events = await eventController.getEventsByDate(
			tomorrow
		);
		// Step 2: Loop through each event and send reminder emails to users who have booked
		for (const event of events) {
			const bookings =
				await bookingController.getBookingsByEventId(
					event._id
				);
			for (const booking of bookings) {
				const user =
					await userController.getUserByIdDirect(
						booking.user
					);
				console.log(user.email);
				await emailController.sendEmailDirect({
					to: user.email,
					subject: "Event Reminder",
					body: `Your event "${event.title}" is happening tomorrow. Don't forget to join us at ${event.venue} !!!`,
				});
			}
		}
	} catch (error) {
		console.error(
			"Error sending scheduled emails:",
			error
		);
	}
});
