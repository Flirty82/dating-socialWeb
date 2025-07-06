// server/routes/games.js
const express = require('express');
const router = express.Router();
const checkDiamond = require('../middleware/checkDiamond');

router.get('/bingo', checkDiamond, (req, res) => {
  res.json({ status: 'OK', game: 'bingo' });
});
