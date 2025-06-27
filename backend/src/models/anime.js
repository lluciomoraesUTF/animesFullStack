const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const FavoriteAnime = sequelize.define('FavoriteAnime', {
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

module.exports = FavoriteAnime;
