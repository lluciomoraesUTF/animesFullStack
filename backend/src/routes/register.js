const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { nome, email, password, nascimento } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      nome,
      email,
      password: hash,
      nascimento,
    });

    res.status(201).json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      nascimento: user.nascimento,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Erro ao registrar usuário.' });
  }
});

module.exports = router;
