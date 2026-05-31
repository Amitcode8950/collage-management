const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/authRoutes')
const feesRoutes = require('./routes/feesRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const materialRoutes = require('./routes/materialRoutes')

const app = express()

// Middlewares
app.use(cors({
    origin: '*', // Allow frontend origin
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static Directories
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/fees', feesRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/materials', materialRoutes)

app.get('/', (req, res) => {
    res.send('College Management API is running...')
})

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('API Error:', err.message)
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected server error occurred'
    })
})

module.exports = app
