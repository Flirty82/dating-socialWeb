module.exports = function requireUpgrade(req, res, next) {
    if (req.user.membership && req.user.membership.isActive) {
        return next();

        if (req.user.membership === 'Free') {
            ;return res.status(403).json({ message: "Upgrade required to access this content"})
        }
        next();
     }
};

const User = require('../models/User');

const checkMembership(requiredLevel) => {
    return async (req, res, next) => {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ message: "User not found" });

        const levels = ["free", "gold", "platinum", "diamond"];
    };
    next();
};

module.exports = checkMembership;