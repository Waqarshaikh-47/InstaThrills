const express = require('express')
const { uploadStatus, likeStatus, commentOnStatus, getStatuses } = require('../controllers/statusController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const { upload } = require('../middlewares/fileUploadMiddleware')

const router = express.Router()

router.post('/upload', authMiddleware, upload.array('attachments'), uploadStatus)
router.post('/like/:id', authMiddleware, likeStatus)
router.post('/comment/:id', authMiddleware, commentOnStatus)
router.get('/', authMiddleware, getStatuses)

module.exports = router
