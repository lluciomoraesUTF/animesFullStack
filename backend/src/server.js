const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');       // /login
const registerRoutes = require('./routes/register'); // /register
const animeRoutes = require('./routes/anime');     // outros
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', registerRoutes); // POST /api/users/register
app.use('/api/users', authRoutes);     // POST /api/users/login
app.use('/api', animeRoutes);          // outras rotas de anime

// Start do servidor
sequelize.sync()
  .then(() => {
    console.log('Banco sincronizado.');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Erro ao sincronizar banco:', err);
  });
