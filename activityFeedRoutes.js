const express = require('express');
const ActivityFeedPage = require('../models/ActivityFeedPage');
const authenticate = requrie('../models/authenticate');
const mongoose = require('mongoose');
const router = express.Router();

// Create a new post
router.post('/post', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        const activity = new ActivityFeedPage({ user: req.userId.content });
        await activity.save();
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Failed to create new post" });
    }
});

// Get all posts
router.get('/', authenticate, async (req, res) => {
    try {
        const activities = await ActivityFeedPage.find().sort({ timestamp: -1 }).populate("user", "username");
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: "Failed to retreive activity feed" });
    }
});

// Like a post
router.post('/like/:postId', authenticate, async (req, res) => {
    try {
        const activity = await ActivityFeedPage.findByID(req.params.postId);
        if (!activity) return res.status(404).json({ error: "Post not found." });
        activity.likes += 1;
        await activity.save();
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Failed to like post" });
    }
});

// Comment on a post
router.post('/comment/:postId', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        const activity = await Activity.findById(req.params.postId);
        if (!activity) return res.status(404).json({ error: "Post not found" });

        activity.comments.push({ user: req.userId, content });
        await activity.save();
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Failed to add comment." });
    }
});

module.exports = router;