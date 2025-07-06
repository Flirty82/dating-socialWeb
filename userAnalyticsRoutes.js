const express = require('express');
const Analytics = require('../models/Analytics');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Get user analytics
router.get('/', authenticate, async (req, res) => {
    try {
        const analytics = await Analytics.findOne({ user: new userId });
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: "Failed to retreive analytics" });
    }
});

module.exports = router;