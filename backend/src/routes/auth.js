require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/user'); 

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: { error: 'Muitas tentativas de login. Tente novamente mais tarde.' },
});

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Dados inválidos.', detalhes: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.warn(`Tentativa de login inválida para o email: ${email}`);
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token });
    } catch (err) {
      console.error('Erro no login:', err);
      res.status(500).json({ error: 'Erro interno no login.' });
    }
  }
);

module.exports = router;
