const { DataTypes } = require("sequelize");
const sequelize = require("./connection");
const Source = require("./source");
const { isNonEmpty } = require("./validations");

const News = sequelize.define(
  'News',
  {
    url: {
      type: DataTypes.TEXT,
      primaryKey: true,
      validate: {
        isUrl: true
      }
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isNonEmpty
      }
    },
    snnipet: {
      type: DataTypes.TEXT
    },
    source: {
      type: DataTypes.TEXT,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isNonEmpty
      }
    },
    pictureUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: 'news'
  }
)

module.exports = News
