const mongoose = require('mongoose')
const express = require('express')


const userSchema = mongoose.Schema({
    user_email: String,
    user_pass: String,
    last_login: {
        type: String,
        default: "Never",
    },
    agent_list: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AGENT'
        }
    ]
})

const USER = mongoose.model('USER', userSchema)
module.exports = USER