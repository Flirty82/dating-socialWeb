// server/middleware/checkDiamond.js
module.exports = function (req, res, next) {
  if (req.user?.membership === 'diamond') return next();
  return res.status(403).json({ message: 'Diamond members only' });
};
// This middleware checks if the user has a diamond membership.