const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const user = sequelize.define('user', {  
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

// Correção do nome do objeto para User e da função associate
user.associate = (models) => {
  user.hasMany(models.Anime, {
    foreignKey: 'userId',
    as: 'animesCriados',
  });

  user.hasMany(models.Favorito, {
    foreignKey: 'userId',
    as: 'favoritos',
  });
};

module.exports = user;