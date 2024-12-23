const express = require('express')
const gameController = require('../controllers/gameController')
const router = express.Router()

router.get('/', gameController.getAttempts)
router.get('/play', gameController.getContent)
router.post('/attempt', gameController.createAttempt)

module.exports = router
