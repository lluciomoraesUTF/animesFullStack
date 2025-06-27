const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// Registro de novo usuário
router.post('/register', async (req, res) => {
  const { nome, email, password, nascimento } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(password, 10);

    const novoUsuario = await User.create({
      nome,
      email,
      password: senhaCriptografada,
      nascimento,
    });

    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

module.exports = router;
