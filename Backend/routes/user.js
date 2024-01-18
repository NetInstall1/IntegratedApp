const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const USER = mongoose.model('User');
const {
  registerUser, authUser
} = require('../controllers/userControllers')


router.post('/register', registerUser)
router.post('/signin', authUser)

module.exports = router;
