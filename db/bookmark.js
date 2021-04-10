const { DataTypes } = require("sequelize");
const sequelize = require("./connection");
const News = require("./news");
const { isNonEmpty } = require("./validations");

const Bookmark = sequelize.define(
  'Bookmark',
  {
    user: {
      type: DataTypes.TEXT,
      primaryKey: true,
      validate: {
        isNonEmpty
      }
    },
    news: {
      type: DataTypes.TEXT,
      primaryKey: true,
      validate: {
        isUrl: true
      },
      references: {
        model: News,
        key: 'url'
      }
    },
  },
  {
    tableName: 'bookmarks'
  }
)

Bookmark.hasOne(News, {sourceKey: 'news', foreignKey: 'url'})
// News.belongsTo(Bookmark)

module.exports = Bookmark;