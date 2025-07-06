const express = require('express');
const Moderation = require('../models/Moderation');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Report content
router.post('/report', authenticate, async (req, res) => {
    try {
        const { reportContentId, contentType, reason } = req.body;
        const report = new Moderation({ reportedBy: req.userId, reportedContent });
        await report.save();
        res.json({ message: "Report submitted." });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit report." });
    }
});

// Admin review reports
router.get('/reports', authenticate, async (req, res) => {
    try {
        const reports = await Moderation.find({ status: "pending" }).populate('reportedBy', 'username');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: "Failed to retreive reports" });
    }
});

module.exports = router;