const { Sequelize } = require('sequelize');

/*const sequelize = new Sequelize('dbanimesfullstack', 'postgres', '12345678', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432, 
  logging: false,
});
*/
const sequelize = new Sequelize('dbanimesfullstack', 'postgres', 'utfpr', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432, 
  logging: false,
});

module.exports = sequelize;