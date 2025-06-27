const express = require('express');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/auth');       
const registerRoutes = require('./src/routes/register'); 
const animeRoutes = require('./src/routes/anime');    
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.use('/api/users', registerRoutes); 
app.use('/api/users', authRoutes);    
app.use('/api', animeRoutes);          

sequelize.sync()
  .then(() => {
    console.log('Banco sincronizado.');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Erro ao sincronizar banco:', err);
  });
