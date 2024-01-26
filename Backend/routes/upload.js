const express = require('express');
const multer = require('multer');
const path = require('path');
const UploadModel = require('../models/upload');
const mongoose = require('mongoose');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/api/upload', upload.single('file'), async (req, res) => {
    // Extract the text fields
    const { softwareName, silentInstallationCommand } = req.body;

    // Check if file is present
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Generate new filename
    const newFilename = softwareName + path.extname(req.file.originalname);

    // Save file to disk or another storage
    // You can use fs.writeFile or any method depending on where you want to save the file
    const fs = require('fs');
    const filePath = path.join(__dirname, '..', 'uploads', newFilename);

    fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send('Error saving file');
        }

        // Save the file metadata to the database
        const newUpload = new UploadModel({
            softwareName,
            silentInstallationCommand,
            filePath
        });

        newUpload.save()
            .then(() => res.status(201).send('File uploaded and saved successfully'))
            .catch(error => {
                console.error('Database error:', error);
                res.status(500).send('Server error:', error);
            });
    });
});

module.exports = router;
