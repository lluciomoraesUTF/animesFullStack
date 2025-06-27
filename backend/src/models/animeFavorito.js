const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const animeFavorito = sequelize.define('animeFavorito', {
  animeId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dados: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

User.hasMany(FavoriteAnime, { foreignKey: 'userId' });
FavoriteAnime.belongsTo(User, { foreignKey: 'userId' });

module.exports = animeFavorito;
