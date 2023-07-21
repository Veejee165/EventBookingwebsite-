const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const jwtSecret = process.env.JWT; // Replace with your own secret key for JWT

exports.sendResetEmail = async (req, res) => {
  const { to, subject, body } = req.body;
  const userId = req.userId; // Retrieve the userId from the request object

  // Generate a JWT token with the userId
  const token = jwt.sign({ userId }, process.env.JWT, { expiresIn: '1h' });
  const resetLink = `http://localhost:4200/reset-password?token=${token}`;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'f20210190@dubai.bits-pilani.ac.in',
      pass: process.env.Password
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'your-email@example.com',
    to,
    subject,
    html: `
      <p>${body}</p>
      <p>Click on the following link to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
exports.sendOrderEmail = async (req, res) => {
    const { to, subject, body } = req.body;
    const orderId = req.orderId;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'f20210190@dubai.bits-pilani.ac.in',
        pass: process.env.Password
      }
    });
  
    // Define the email options
    const mailOptions = {
      from: 'your-email@example.com',
      to,
      subject,
      html: `
        <p>YOur Order has been Confirmed with order ID ${orderId}</p>
      `
    };
  
    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  };
  