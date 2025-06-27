const express = require('express');
const jwt = require('jsonwebtoken');
const FavoriteAnime = require('../models/anime');
const User = require('../models/user');

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
    res.status(401).json({ error: 'Token inválido.' });
  }
}

router.get('/favoritos', autenticar, async (req, res) => {
  try {
    const favoritos = await FavoriteAnime.findAll({
      where: { userId: req.user.id },
    });
    res.json(favoritos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar favoritos.' });
  }
});

router.post('/favoritos', autenticar, async (req, res) => {
  const { animeId, titulo, dados } = req.body;

  try {
    const jaExiste = await FavoriteAnime.findOne({
      where: { userId: req.user.id, animeId },
    });

    if (jaExiste) {
      return res.status(400).json({ error: 'Anime já favoritado.' });
    }

    const favorito = await FavoriteAnime.create({
      animeId,
      titulo,
      dados,
      userId: req.user.id,
    });

    res.status(201).json(favorito);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao favoritar anime.' });
  }
});

router.delete('/favoritos/:id', autenticar, async (req, res) => {
  try {
    const deleted = await FavoriteAnime.destroy({
      where: {
        userId: req.user.id,
        animeId: req.params.id,
      },
    });

    if (!deleted) return res.status(404).json({ error: 'Anime não encontrado.' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover favorito.' });
  }
});

module.exports = router;
