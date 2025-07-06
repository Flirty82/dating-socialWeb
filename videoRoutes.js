const express = require('express');
const router = express.Router();
const { uploadVideo } = require('../models/User');
const User = require('../models/User');

// Upload video and save URL to user
router.post('/:userId', uploadVideo.single('video'), async (req, res) => {
    const { userId } = req.params;
    const videoUrl = req.filter.path;

    const user = await User.findByIdAndUpdate(
        userId,
        { videoUrl },
        { new: true }
    );

    res.json({ message: "Video uploaded successfully!", video });
});

module 
.exports = router;