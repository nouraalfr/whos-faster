const express = require('express')
const authController = require('../controllers/authController')
const csrf = require('../middlewares/csrf')
const { check } = require('express-validator')
const formParser = require('../middlewares/body-parser')
const router = express.Router()

function notAuthenticated(req, res, next) {
  if (req.session.user) {
    res.redirect('/')
  } else {
    next()
  }
}

router.get('/register', notAuthenticated, csrf, authController.getRegister)

router.post(
  '/register',
  notAuthenticated,
  formParser,
  [
    check('username').notEmpty().withMessage('اسم المستخدم مطلوب').trim().isLength(3).withMessage('يجب ان يكون اسم المستخدم ٣ احرف على الاقل ').escape(),
    check('password').notEmpty().withMessage('الرمز السري مطلوب').trim().isLength(8).withMessage('يجب ان يكون الرمز السري ٨ احرف على الاقل').escape(),
    check('confirm_password').notEmpty().withMessage('تأكيد الرمز السري مطلوب').trim().escape(),
  ],
  authController.postRegister,
)

router.get('/login', notAuthenticated, csrf, authController.getLogin)

router.post(
  '/login',
  formParser,
  notAuthenticated,
  [check('username').notEmpty().withMessage('اسم المستخدم مطلوب').trim().escape(), check('password').notEmpty().withMessage('الرمز السري مطلوب').trim().escape()],
  authController.postLogin,
)

router.get('/logout', authController.logout)

module.exports = router
