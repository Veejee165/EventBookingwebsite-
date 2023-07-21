const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
      unique: true
    },
    discount: {
      type: Number,
      required: true
    },
    expirationDate: {
      type: Date,
      required: true
    },
    userCount: {
      type: Number,
      default: 0
    },
    maxUserCount: {
      type: Number
    }
  });
  
const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
