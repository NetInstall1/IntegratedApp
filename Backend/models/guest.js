const express = require('express')
const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema({
    hostname: String,
    ip_address: String,
    mac_address: String,
    status: String,
    os:String,
    action: String,
    installed_software:[{type: mongoose.Schema.Types.ObjectId, ref: 'SOFTWARE'}]
})

const GUEST = mongoose.model('GUEST', guestSchema)
module.exports = GUEST