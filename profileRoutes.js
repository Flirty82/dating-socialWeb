const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to authenticate user routes
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
};

// Get user profile
router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findById('req.userId');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

module.exports = router;