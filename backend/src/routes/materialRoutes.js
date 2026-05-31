const express = require('express')
const router = express.Router()
const { getMaterials, uploadMaterial, downloadMaterial } = require('../controllers/materialController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Public viewing, download
router.get('/', getMaterials)
router.get('/download/:id', downloadMaterial)

// Protected uploads (requires active student/admin login context)
router.post('/upload', protect, upload.single('file'), uploadMaterial)

module.exports = router
