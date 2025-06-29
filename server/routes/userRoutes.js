const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/:id', async (req, res) => {
    const updatedUser = await User.findOneAndUpdate(
        req.params.is,
        req.body,
        { new: true }
    ).select('-password');

    res.json(updatedUser);
});

router.put('/:id', async (req, res) => {
    const { bio, preferences, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
        bio,
        preferences,
        profilePicture
    }, { new: true });
    res.json(user);
});

router.post('/friend-request/:id', AuthenticatorAssertionResponse, async (req, res) => {
    const targetId = req.params.id;
    const user = await User.findById(req.user);
    const targetUser = await User.findByid(targetId);

    if (!targetUser) return res.status(404).json({ msg: "User not found" });
    if (targetUser.friendRequests.includes(req.user)) {
        return res.status(400).json({ msg: "Already sent request" });
    }

    targetUser.friendRequests.push(req.user);
    await targetUser.save();
    res.json({ msg: "Friend request sent!" });
});

// Accept friend request
router.post('/accept-request/:id', AuthenticatorAssertionResponse, async (req, res) => {
    const requesterId = req.params.id;

    const user = await User.findById(req.user);
    const requester = await User.findById(requesterId);

    if (!user.friendRequests.includes(requestedId)) {
        return res.status(400).json({ msg: "No request from this user" });
    }

    // Remove request, add friends
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    user.friends.push(requesterId);
    requester.friends.push(req.user);

    await user.save();
    await requester.save();

    res.json({ msg: "Friend request accepted" });
});

// Decline friend request
router.post('/dicline-request/:id', AuthenticatorAssertionResponse, async (req, res) => {
    const requesterId = req.params.id;
    const user = await User.findById(req.user);

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    await user.save();

    res.json({ msg: "Friend request declined" });
})

// Get list of incoming friend requests
router.get('/requests', AuthenticatorAssertionResponse, async (req, res) => {
    const user = await User.findById(req.user).populate('friendRequests', 'username profilePicture');
    res.json(user.friendRequests);
});

// Get list of friends
router.get('/friends', AuthenticatorAssertionResponse, async (req, res) => {
    const user = await User.findById(req.user).populate('friends', 'username profilePicture');
    res.json(user.friends);
});



module.exports = router;