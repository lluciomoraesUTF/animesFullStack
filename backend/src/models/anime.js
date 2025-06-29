const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const anime = sequelize.define('anime', {
  titulo: DataTypes.STRING,
  poster: DataTypes.STRING,
  startDate: DataTypes.STRING,
  endDate: DataTypes.STRING,
  synopsis: DataTypes.TEXT,
  averageRating: DataTypes.STRING,
  episodeCount: DataTypes.INTEGER,
  dados: DataTypes.JSONB,
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id'       
    }
  }
});

module.exports = anime;