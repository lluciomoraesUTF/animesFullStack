const express = require('express');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const Anime = require('../models/anime');
const User = require('../models/user');

const router = express.Router();
const SECRET = 'JWToken';

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token ausente.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente.' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

router.get('/', async (req, res) => {
  try {
    const animes = await Anime.findAll();
    res.json(animes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar animes.' });
  }
});

router.get('/buscar', async (req, res) => {
  const { titulo } = req.query;

  try {
    const animes = await Anime.findAll({
      where: {
        titulo: {
          [Op.iLike]: `%${titulo}%`,
        },
      },
    });
    res.json(animes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar por título.' });
  }
});

router.post('/', autenticar, async (req, res) => {
  const { titulo, poster, startDate, endDate, synopsis, averageRating, episodeCount } = req.body;

  try {
    const anime = await Anime.create({
      titulo,
      poster,
      startDate,
      endDate,
      synopsis,
      averageRating,
      episodeCount,
      userId: req.user.id,
    });

    res.status(201).json(anime);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar anime.' });
  }
});

router.put('/:id', autenticar, async (req, res) => {
  const animeId = req.params.id;
  const { titulo, poster, startDate, endDate, synopsis, averageRating, episodeCount } = req.body;

  try {
    const anime = await Anime.findOne({ where: { id: animeId } });

    if (!anime) {
      return res.status(404).json({ error: 'Anime não encontrado.' });
    }

    if (anime.userId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este anime.' });
    }

    await anime.update({
      titulo,
      poster,
      startDate,
      endDate,
      synopsis,
      averageRating,
      episodeCount,
    });

    res.json(anime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao editar anime.' });
  }
});

// Deletar anime
router.delete('/:id', autenticar, async (req, res) => {
  const animeId = req.params.id;

  try {
    const anime = await Anime.findOne({ where: { id: animeId } });

    if (!anime) {
      return res.status(404).json({ error: 'Anime não encontrado.' });
    }

    if (anime.userId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este anime.' });
    }

    await anime.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar anime.' });
  }
});

module.exports = router;
