const bcrypt = require('bcrypt')
const db = require('../db')
const { validationResult } = require('express-validator')

exports.getRegister = (req, res) => {
  res.render('register', { csrfToken: req.csrfToken() })
}

exports.postRegister = async (req, res) => {
  const { username, password, confirm_password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).render('register', { errors: errors.array() })
  }

  if (password !== confirm_password) {
    return res.render('register', { errors: [{ msg: 'الرمز السري لا يطابق رمز التأكيد' }] })
  }

  const hashedPass = await bcrypt.hash(password, 10)
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPass], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.render('register', { errors: [{ msg: 'اسم المستخدم موجود مسبقاً' }] })
      }
      console.log(err)
      return res.status(500).render('register', { errors: [{ msg: 'حدث خطأ ما' }] })
    }
    res.redirect('/login')
  })
}

exports.getLogin = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() })
}

exports.postLogin = (req, res) => {
  const { username, password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400)
    return res.render('login', { errors: errors.array() })
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows) => {
    if (err) {
      console.log(err)
      res.status(500)
      return res.render('login', { errors: [{ msg: 'حدث خطا ما' }] })
    }

    if (rows.length === 0) {
      res.status(403)
      return res.render('login', { errors: [{ msg: 'خطأ في كلمة المرور او الاسم' }] })
    }

    const user = rows[0]
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(403)
      return res.render('login', { errors: [{ msg: 'خطأ في كلمة المرور او الاسم' }] })
    }

    req.session.regenerate(function (err) {
      if (err) next(err)
      req.session.user = user
      req.session.save(function (err) {
        if (err) return next(err)
        res.redirect('/play')
      })
    })
  })
}

exports.logout = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}
