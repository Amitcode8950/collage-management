const express = require('express')
const router = express.Router()
const { getFees, payFee } = require('../controllers/feesController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/', getFees)
router.post('/pay', payFee)

module.exports = router
