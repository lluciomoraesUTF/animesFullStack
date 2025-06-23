const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = 'JWToken';

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente.' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    console.log("JWToken")
    res.status(401).json({ error: 'Token inválido.' });
  }
}

router.get('/animes', autenticar, (req, res) => {
  res.json([
    { id: 1, title: 'Naruto' },
    { id: 2, title: 'One Piece' },
  ]);
});

module.exports = router;
