const express = require('express')
const mongoose = require('mongoose')

const hostSchema = new mongoose.Schema({
    hostname: String,
    ip_address: String,
    mac_address: String,
    status: String,
    device_type: String,
    os:String
})

const HOST = mongoose.model('HOST', hostSchema)
module.exports = HOST