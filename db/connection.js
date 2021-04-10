const path = require('path')
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(`sqlite:${path.join(__dirname, '../dbfile.db')}`);
module.exports = sequelize;
module.exports.sequelize = sequelize;
