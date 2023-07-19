const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT; // Replace with your own secret key for JWT

exports.authenticate = (req, res, next) => {
  // Get the JWT token from the request headers
  const token = req.headers.authorization;
  console.log(req.headers.authorization)
  if (!token) {
    return res.status(401).json({ error: 'Authorization token not found' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the user ID to the request object for further use
    req.userId = decoded.userId;

    // Proceed to the next middleware
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

