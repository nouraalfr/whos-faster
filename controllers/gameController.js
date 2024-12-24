const db = require('../db')

exports.getAttempts = (_, res) => {
  db.query(
    'SELECT MAX(attempts.score) AS top , users.username FROM attempts JOIN users ON attempts.user_id=users.id GROUP BY users.username ORDER BY top DESC LIMIT 10;',
    (err, rows) => {
      if (err) {
        console.log(err)
        return res.render('index')
      }

      if (rows.length === 0) {
        console.log('NO ATTEMPTS TO QUERY')
        return res.render('index')
      }

      res.render('index', { attempts: rows })
    },
  )
}

exports.createAttempt = async (req, res) => {
  const user = req.session.user
  const score = req.body.score
  const textID = req.body.textID

  db.query('INSERT INTO attempts (user_id,text_id,score) VALUES (?,?,?)', [user.id, textID, score], (err) => {
    if (err) {
      console.log(err)
      res.status(500)
      return res.render('play', { errors: [{ msg: 'حدث خطا ما' }] })
    }
  })
}

exports.getContent = (_, res) => {
  db.query('SELECT content , id  FROM texts ORDER BY RAND() LIMIT 1', (err, rows) => {
    if (err) {
      console.log(err)
      res.status(500)
      return res.render('play', { errors: [{ msg: 'حدث خطأ ما' }] })
    }

    if (rows.length === 0) {
      console.log('NO TEXTS TO QUERY')
      res.status(500)
      return res.render('play', { errors: [{ msg: 'حدث خطأ ما' }] })
    }

    const content = rows[0].content
    const textID = rows[0].id
    res.render('play', { content: content, textID: textID })
  })
}
