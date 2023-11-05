const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const USER = mongoose.model('USER');

// POST request to authenticate a user
router.post('/api/authenticate', async (req, res) => {
    try {
        const { user_email, user_pass } = req.body;

        // Find the user by email
        const date = new Date();
        const dateTimeOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dateTimeFormatted = date.toLocaleString(undefined, dateTimeOptions);
        console.log(dateTimeFormatted);
        const user = await USER.findOneAndUpdate(
            { user_email, },
            { last_login: dateTimeFormatted }
        );

        if (!user) {
    // User not found
          return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    // Check if the provided password matches the user's password
    if (user.user_pass !== user_pass) {
      // Password doesn't match
      return res.status(401).json({ message: 'Authentication failed. Password incorrect.' });
    }

    // Authentication successful
    res.status(200).json({ message: 'Sign In successful', user });
  } catch (error) {
    // Handle any errors that occur during authentication
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

module.exports = router;
