const express = require('express')
const router = express.Router()
const {
    register,
    login,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Register student with avatar image upload
router.post('/register', upload.single('image'), register)

// Login student
router.post('/login', login)

// Forgot Password Flow
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Get & Update Profile
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, upload.single('image'), updateProfile)

module.exports = router
