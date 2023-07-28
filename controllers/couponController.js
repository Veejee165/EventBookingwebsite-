const Coupon = require('../models/couponmodel');

exports.getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve coupons' });
    }
  };

  exports.getCouponById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve coupon' });
    }
  };

// Check Coupon Code Validity
exports.checkCouponValidity = async (req, res) => {
  const { couponCode } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon code not found' });
    }
    if (coupon.expirationDate < new Date()) {
        return res.status(403).json({ error: 'Coupon code has expired' });
      }

    if (coupon.userCount >= coupon.maxUserCount) {
      return res.status(403).json({ error: 'Coupon code has reached maximum usage' });
    }

    const discount = coupon.discount; // Get the associated discount information
    const id = coupon._id;
    res.json({ valid: true, discount, id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check coupon code validity' });
  }
};

exports.updateUserCount = async (req, res) => {
  try {
    const id = req.body.Cid; // Change to req.body
    const updates = { $inc: { userCount: 1 } };
    const coupon = await Coupon.findByIdAndUpdate(
      id, // Find the coupon by the code
      updates, // Increment userCount by 1
      { new: true } // Return the updated document
    );

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon code not found' });
    }

    res.json({ message: 'User count updated successfully', coupon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user count' });
  }
};



exports.createCouponCode = async (req, res) => {
    const { code, discount, expirationDate, maxUserCount } = req.body;
  
    try {
      let existingCoupon = await Coupon.findOne({ code });
  
      if (existingCoupon) {
        // Check if the existing coupon is valid
        if (existingCoupon.expirationDate > Date.now() && existingCoupon.userCount < existingCoupon.maxUserCount) {
          return res.status(409).json({ error: 'Coupon code already exists and is valid' });
        } else {
          // Delete the existing coupon
          await Coupon.findByIdAndDelete(existingCoupon._id);
        }
      }
  
      const coupon = await Coupon.create({
        code,
        discount,
        expirationDate,
        maxUserCount,
        userCount: 0,
        active: true
      });
  
      res.status(201).json(coupon);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create coupon code' });
    }
  };
  
// Delete a Coupon Code
exports.deleteCouponCode = async (req, res) => {
    const { id: couponId } = req.params;
  
    try {
      const coupon = await Coupon.findByIdAndDelete(couponId);
  
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon code not found' });
      }
  
      res.json({ message: 'Coupon code deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete coupon code' });
    }
  };
