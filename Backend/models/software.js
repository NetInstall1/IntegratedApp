const express = require('express')
const mongoose = require('mongoose')

const softwareSchema = mongoose.Schema({
    software_name: String,
    software_public_url: String,
    software_version: String,
    agent_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Agent'}
})

const Software = mongoose.model('Software', softwareSchema)
module.exports = Software