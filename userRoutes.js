router.get('/search', async (req, res) => {
    const { gender, minAge, maxAge, location, interestedIn } = req.query;

    const query = {};

    if (gender) query.gender = gender;
    if (location) query.location = { $regex: new RegExp(location, 'i' )};

    if (minAge || maxAge) {
        query.age = {};
        if (minAge) query.age.$gte = parseInt(minAge);
        if (maxAge) query.age.$lte = parseInt(maxAge);
    }

    if (interestedIn) {
        query['preferences.gender'] = { $in: [interestedIn]};
    }

    const users = await user.find(query.select('-password'));
    res.json(users);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Upload profile picture
router.post('/me/profilePicture', auth, upload.single('profilePicture') = async (req, res) => {
    const file = req.file;
    of (!file) return res.status(400).json({ msg: "No file uploaded" });

    const user = await User.findByIdAndUpdate(req.user, {
        profilePicture: file.filename
    }, { new: true }).select('-password');

    res.json(user);
});

// Middleware
function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch {
        res.status(400).json({ msg: "Invalid token" });
    }
}

// Get current user's profile
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
});

// Update Profile
router.put('/me', auth, async (req, res) => {
    const { username, bio } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user,
        { username, bio },
        { new: true }
    ).select('-password');
    res.json(user);
} );

module.exports = router;