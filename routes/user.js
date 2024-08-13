const express = require('express')
const { followUser } = require('../controllers/userController')
const { authMiddleware } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/follow/:id', authMiddleware, followUser)

module.exports = router
