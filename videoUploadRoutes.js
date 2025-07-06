const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// Set up video storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos');
    }
});