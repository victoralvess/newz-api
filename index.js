const express = require('express')
const helmet = require('helmet')

const db = require('./db/connection')

const Bookmark = require('./db/bookmark')
const News = require('./db/news')
const Source = require('./db/source')


const app = express()
app.use(helmet())
app.use(express.json())

app.get('/bookmarks/:user', async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: {
        user: req.params.user
      },
      include: {
        model: News,
        include: {
          model: Source
        }
      }
    })

    return res.send(bookmarks.map((bookmark) => {
      const news = bookmark.News

      return {
        ...news.toJSON(),
        source: news.Source.toJSON(),
        Source: undefined
      }
    }))
  } catch (e) {
    return res.status(500).send({
      message: e.message
    })
  }
})

app.post('/bookmarks/:user', async (req, res) => {
  const t = await db.transaction();

  try {
    const payload = req.body

    const source = await Source.findOrCreate({
      where: {
        id: payload.source.id
      },
      defaults: {
        id: payload.source.id,
        name: payload.source.name
      },
      transaction: t
    })

    const news = await News.create({
      ...payload,
      source: payload.source.id
    })

    const bookmark = Bookmark.create({
      user: req.params.user,
      news: payload.url
    })
    
    await t.commit()

    const data = news.toJSON()
    data.source = source.toJSON()
    return res.send(data)
  } catch (e) {
    await t.rollback()

    return res.status(500).send({
      message: e.message
    })
  }
})

Promise.all([
  Source.sync(),
  News.sync(),
  Bookmark.sync()
]).then(() => {
  const port = process.env.PORT || '3000'
  app.listen(port, () => {
    console.log(`running at http://0.0.0.0:${port}`)
  })
})
