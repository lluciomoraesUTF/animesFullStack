const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const animeRoutes = require('./routes/anime');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api', animeRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  console.log('Banco sincronizado.');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});
