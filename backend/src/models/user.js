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

module.exports = user;
