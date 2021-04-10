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
        model: News
      }
    })

    const news = await Promise.all(bookmarks.map(async (bookmark) => {
      const news = bookmark.News
      const source = await Source.findOne({
        where: {
          id: news.source
        }
      })

      return {
        ...news.toJSON(),
        source: source.toJSON(),
        Source: undefined
      }
    }))

    return res.send(news)
  } catch (e) {
    return res.status(500).send({
      message: e.message
    })
  }
})

app.post('/bookmarks/:user', async (req, res) => {
  console.log('[REQUEST]', JSON.stringify(req.body))
  try {
    const payload = req.body

    const [source] = await Source.findOrCreate({
      where: {
        id: payload.source.id
      },
      defaults: {
        id: payload.source.id,
        name: payload.source.name
      },
    })

    console.log('[REQUEST]', 'SOURCE')

    const news = await News.create({
      ...payload,
      source: source.id,
      publishedAt: new Date(payload.publishedAt)
    })

    console.log('[REQUEST]', 'NEWS')

    const bookmark = Bookmark.create({
      user: req.params.user,
      news: payload.url
    })

    console.log('[REQUEST]', 'BOOKMARK')

    const data = news.toJSON()
    data.source = source.toJSON()
    return res.send(data)
  } catch (e) {
    console.log('[REQUEST]', e.message, e.stack)

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
