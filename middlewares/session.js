const session = require('express-session')
require('dotenv').config()

module.exports = session({
  secret: process.env.SESSION_KEY,
  cookie: { maxAge: 86400000 * 10 },
  resave: false,
  saveUninitialized: false,
})
