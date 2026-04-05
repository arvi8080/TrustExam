const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role: role || 'student', ipAddress: req.ip });
    await user.save();
    const secret = process.env.JWT_SECRET || 'trustexam-fallback-secret-2024-super-long-key-for-jwt-signing-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGH';
    const token = jwt.sign({ id: user._id, role: user.role }, secret);
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    // Check for MongoDB duplicate key error
    if (error.code === 11000 || error.message?.includes('E11000') || error.message?.includes('duplicate key')) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    res.status(400).json({ message: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is blocked (only for students)
    if (user.role === 'student' && user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked by the administrator' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    const secret = process.env.JWT_SECRET || 'trustexam-fallback-secret-2024-super-long-key-for-jwt-signing-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGH';
    const token = jwt.sign({ id: user._id, role: user.role }, secret);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
