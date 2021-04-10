const express = require('express')
const helmet = require('helmet')

const db = require('./db/connection')


const app = express()
app.use(helmet())
app.use(express.json())

app.get('/bookmarks/:user', (req, res) => {
  const stmt = db.prepare(`
    SELECT
      n.*,
      s.*
    FROM 
      bookmarks b 
      JOIN news n ON b.news = n.url
      JOIN sources s ON n.source = s.id
    WHERE
      b.user = ?
  `)
    .bind([req.params.user])
    .all((error, rows) => {
    console.log(error, rows)
    if (error) {
      res.status(500).send(error)
    } else {
      res.send((rows || []).map(row => ({
        ...row,
        source: {
          id: row.id,
          name: row.name
        },
        id: undefined,
        name: undefined
      })))
    }
  })
})

const port = process.env.PORT || '3000'
app.listen(port, () => {
  console.log(`running at http://0.0.0.0:${port}`)
})