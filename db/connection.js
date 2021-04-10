const path = require('path')
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(`sqlite::memory:`);
module.exports = sequelize;
module.exports.sequelize = sequelize;
