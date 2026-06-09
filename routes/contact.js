const express = require('express');
const router  = express.Router();

// POST /api/contact — receive a contact form message
router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  // Check all fields are filled
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and message'
    });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // For now we just log it to the terminal
  // In Phase 5 we'll save this to MongoDB
  console.log('New contact message received:');
  console.log(`  Name:    ${name}`);
  console.log(`  Email:   ${email}`);
  console.log(`  Message: ${message}`);

  res.status(200).json({
    success: true,
    message: 'Thanks for your message! I will get back to you soon.'
  });
});

module.exports = router;