const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already in exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        
    }
})