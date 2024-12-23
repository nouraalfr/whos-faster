const express = require('express')
const path = require('path')
const session = require('./middlewares/session')
const authRoutes = require('./routes/auth')
const gameRoutes = require('./routes/game')
const app = express()

app.use(express.json())
app.use(session)
app.use(express.static(path.join(__dirname, 'public')))

function fillContext(req, res, next) {
  res.locals.user = req.session.user
  res.locals.path = req.path
  next()
}
app.use(fillContext)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', authRoutes)
app.use('/', gameRoutes)

const port = 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
