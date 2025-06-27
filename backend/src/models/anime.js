const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Anime = sequelize.define('Anime', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poster: DataTypes.STRING,
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  synopsis: DataTypes.TEXT,
  averageRating: DataTypes.STRING,
  episodeCount: DataTypes.INTEGER,
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Anime;
