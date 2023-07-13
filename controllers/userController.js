const User = require('../models/usermodel');

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
};
