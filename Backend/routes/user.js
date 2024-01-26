const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const USER = mongoose.model('USER');

// POST request to authenticate a user
router.post('/api/authenticate', async (req, res) => {
  try {
      const { user_email, user_pass } = req.body;
      const user = await USER.findOne({ user_email });

      if (!user || user.user_pass !== user_pass) {
          return res.status(401).json({ message: 'Authentication failed. User not found or password incorrect.' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

      res.status(200).json({ message: 'Sign In successful', user, token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/api/create-user', async (req, res) => {
    try {
      const { user_email, user_pass } = req.body;
  
      // Check if the user with the provided email already exists
      const existingUser = await USER.findOne({ user_email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User with that email already exists' });
      }
  
      // Create a new user
      const newUser = new USER({ user_email, user_pass });
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/api/validate-token', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }

        // Token is valid
        res.status(200).json({ message: 'Token is valid', userId: decoded.userId });
    });
});

module.exports = router;
