const express = require('express')
const router = express.Router()
const { getTeachers } = require('../controllers/teacherController')

router.get('/', getTeachers)

module.exports = router
