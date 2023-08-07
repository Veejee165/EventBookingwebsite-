const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
   },
   paymentIntentId: {
      type: String,
      required: true,
   },
   date: {
      type: Date,
      required: true,
   },
   quantity: {
      type: Number,
      required: true,
   },
   paid: {
      type: Number,
      required: true,
   },
})

const Booking = mongoose.model("Booking", bookingSchema)
module.exports = Booking
