const User = require('../models/User');

// Find compatible matches basked on preferences
const findMatches = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return [];

    const matches = await User.find({
        _id: { $ne: userId }, // Exclude current user
        "datingPreferences.gender" : { $in: [user.datingPreferences.gender, "any" ]},
        "dating Preferences.ageRange.0" : { $te: user.datingPreferences.ageRange[1] }, // Age range check
        "dating Preferences.ageRange.1" : { $gte: user.datingPreferences.ageRange },
        location: user.location
    });

    return matches;
};

module.exports = findMatches;

