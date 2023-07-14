const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const saltRounds = 10;
const jwtSecret = process.env.JWT; // Replace with your own secret key for JWT

// Register a new user
exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = await User.create({ username, password: hashedPassword, email });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to register user' });
  }
};

// Login and generate JWT token
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret);

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Failed to login' });
  }
};

