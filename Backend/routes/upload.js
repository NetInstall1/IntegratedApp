const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const UploadModel = require('../models/upload');
const mongoose = require('mongoose');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let newUploads = [];

router.post('/api/upload', upload.single('file'), async (req, res) => {
    const { softwareName, silentInstallationCommand } = req.body;

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newFilename = softwareName + path.extname(req.file.originalname);
    const filePath = path.join(__dirname, '..', 'uploads', newFilename);

    fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send('Error saving file');
        }

        const newUpload = new UploadModel({
            softwareName,
            silentInstallationCommand,
            filePath
        });

        newUpload.save()
            .then(() => {
                newUploads.push({ softwareName, silentInstallationCommand, filePath });
                res.status(201).json({ message: 'File uploaded successfully', fileId: newUpload.id });
            })
            .catch(error => {
                console.error('Database error:', error);
                res.status(500).send('Server error:', error);
            });
    });
});

router.get('/api/uploaded-files', async (req, res) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            return res.status(500).send('Error reading uploads directory');
        }
        res.json(files);
    });
});

router.get('/api/new-uploads', (req, res) => {
    res.json(newUploads);
    newUploads = []; 
});

module.exports = router;
