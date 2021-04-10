const db = require('./connection')

db.serialize(() => {
  db.run(`
    CREATE TABLE sources (
      id TEXT PRIMARY KEY,
      name TEXT
    )
  `)

  db.run(`
    CREATE TABLE news (
      url TEXT PRIMARY KEY,
      title TEXT,
      snippet TEXT,
      source TEXT,
      author TEXT,
      pictureUrl TEXT,
      publishedAt TEXT,
      FOREIGN KEY(source) REFERENCES sources(id)
    )
  `)

  db.run(`
    CREATE TABLE bookmarks (
      user TEXT,
      news TEXT,
      FOREIGN KEY(news) REFERENCES news(url),
      PRIMARY KEY (user, news)
    )
  `)
})