const mongoose = require('mongoose');
const express = require('express')


const uploadSchema = new mongoose.Schema({
    softwareName: String,
    silentInstallationCommand: String,
    filePath: String, // This will store the path to where the file is saved
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Upload', uploadSchema);
