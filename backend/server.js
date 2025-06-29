const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');

const User = require('./src/models/user');
const Anime = require('./src/models/anime');
const Favorito = require('./src/models/animeFavorito');

const authRoutes = require('./src/routes/auth');
const registerRoutes = require('./src/routes/register');
const animeRoutes = require('./src/routes/anime');
const favoritoRoutes = require('./src/routes/animeFavorito'); 

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/users', registerRoutes);
app.use('/api/users', authRoutes);
app.use('/api/animes', animeRoutes);
app.use('/api/favoritos', favoritoRoutes); 

const models = { User, Anime, Favorito };
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('📦 Banco sincronizado.');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Erro ao sincronizar banco:', err);
  });
