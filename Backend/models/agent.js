const express = require('express')
const mongoose = require('mongoose')

const agentSchema = mongoose.Schema({
    agent_name:String,
    hostname: String,
    ip_address: String,
    mac_address: String,
    status: String,
    os:String,
    guest_user: String,
    guest_pass: String,
    ip_range: String,
    guest_list:[{type: mongoose.Schema.Types.ObjectId, ref: 'GUEST'}],
    
})

const AGENT = mongoose.model('AGENT', agentSchema)
module.exports = AGENT