const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Search users based on filters
router.post('/', async (req, res) => {
    const { gender, lookingFor, age, location, } = req.body;

    const minAge = age?.min || 18;
    const maxAge = age?max || 99

    const query = {
        age: { $gte: minAge, $lte: maxAge },
        gender: lookingFor !== 'any' ? lookingFor : { $in: ['male', 'female', 'any']}
    };

    if (location) { 
        query.location = new RegExp(location, 'i');
    }

    const matches = await User.find(query).select('-password');
    res/json(matches);
});

module.exports = router;