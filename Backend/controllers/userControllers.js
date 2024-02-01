const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')
const User = mongoose.model('User')
const generateToken = require('../config/generateToken')

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { user_email, user_pass } = req.body;

    if ( !user_email || !user_pass) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ user_email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        user_email,
        user_pass,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.user_email,
            // token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { user_email, user_pass } = req.body
    console.log(user_email)
    const user = await User.find({})
    console.log("What is it printing?")
    console.log(user)
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
        console.log(user)
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});


module.exports = {
    registerUser,
    authUser
}