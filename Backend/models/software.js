const express = require('express')
const mongoose = require('mongoose')

const softwareSchema = mongoose.Schema({
    software_name: String,
    software_public_url: String,
    software_version: String,
})

const SOFTWARE = mongoose.model('SOFTWARE', softwareSchema)
module.exports = SOFTWARE