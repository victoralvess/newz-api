const { DataTypes } = require("sequelize");
const sequelize = require("./connection");
const { isNonEmpty } = require("./validations");

module.exports = sequelize.define(
  'Source',
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isNonEmpty
      }
    }
  },
  {
    tableName: 'sources'
  }
)