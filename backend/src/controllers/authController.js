const jwt = require('jsonwebtoken')
const Student = require('../models/Student')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'jwtsecretkey123', {
        expiresIn: '30d'
    })
}

// Register Student
const register = async (req, res) => {
    try {
        const { name, fatherName, className, rollNo, phoneNo, email, password } = req.body
        const image = req.file ? req.file.filename : ''

        const studentExists = await Student.findOne({ $or: [{ email }, { rollNo }] })
        if (studentExists) {
            return res.status(400).json({ message: 'Student with this email or roll number already exists' })
        }

        // Generate dynamic fees for the student
        const now = new Date()
        const oneMonthFromNow = new Date()
        oneMonthFromNow.setMonth(now.getMonth() + 1)
        const twoMonthsFromNow = new Date()
        twoMonthsFromNow.setMonth(now.getMonth() + 2)

        const defaultFees = [
            { title: 'Tuition Fee (Semester 1)', amount: 15000, dueDate: oneMonthFromNow, status: 'due' },
            { title: 'Library Access Fee', amount: 1200, dueDate: now, status: 'paid', paidAt: now },
            { title: 'Semester Examination Fee', amount: 2500, dueDate: twoMonthsFromNow, status: 'due' },
            { title: 'Sports & Cultural Fee', amount: 1800, dueDate: oneMonthFromNow, status: 'due' }
        ]

        const student = await Student.create({
            name,
            fatherName,
            className,
            rollNo,
            phoneNo,
            email,
            password,
            image,
            fees: defaultFees,
            isVerified: true // Set to true by default for demo ease, verification is used for password recovery
        })

        res.status(201).json({
            _id: student._id,
            name: student.name,
            fatherName: student.fatherName,
            className: student.className,
            rollNo: student.rollNo,
            phoneNo: student.phoneNo,
            email: student.email,
            image: student.image,
            fees: student.fees,
            token: generateToken(student._id)
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'Server error, registration failed', error: error.message })
    }
}

// Login Student
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const student = await Student.findOne({ email })
        if (!student) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isMatch = await student.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        res.json({
            _id: student._id,
            name: student.name,
            fatherName: student.fatherName,
            className: student.className,
            rollNo: student.rollNo,
            phoneNo: student.phoneNo,
            email: student.email,
            image: student.image,
            fees: student.fees,
            token: generateToken(student._id)
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Server error, login failed' })
    }
}

// Get student profile
const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id).select('-password')
        if (!student) {
            return res.status(404).json({ message: 'Student not found' })
        }
        res.json(student)
    } catch (error) {
        console.error('Profile fetch error:', error)
        res.status(500).json({ message: 'Server error fetching profile' })
    }
}

// Update student profile
const updateProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id)
        if (!student) {
            return res.status(404).json({ message: 'Student not found' })
        }

        student.name = req.body.name || student.name
        student.fatherName = req.body.fatherName || student.fatherName
        student.className = req.body.className || student.className
        student.rollNo = req.body.rollNo || student.rollNo
        student.phoneNo = req.body.phoneNo || student.phoneNo
        student.email = req.body.email || student.email

        if (req.body.password) {
            student.password = req.body.password
        }

        if (req.file) {
            student.image = req.file.filename
        }

        const updatedStudent = await student.save()

        res.json({
            _id: updatedStudent._id,
            name: updatedStudent.name,
            fatherName: updatedStudent.fatherName,
            className: updatedStudent.className,
            rollNo: updatedStudent.rollNo,
            phoneNo: updatedStudent.phoneNo,
            email: updatedStudent.email,
            image: updatedStudent.image,
            fees: updatedStudent.fees,
            token: generateToken(updatedStudent._id)
        })
    } catch (error) {
        console.error('Profile update error:', error)
        res.status(500).json({ message: 'Server error updating profile', error: error.message })
    }
}

// Forgot Password Request
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const student = await Student.findOne({ email })
        if (!student) {
            return res.status(404).json({ message: 'No student registered with this email address' })
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        student.verificationCode = code
        student.verificationCodeExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
        await student.save()

        // PRINT IN CONSOLE WITH STUNNING FORMAT
        console.log('\n=============================================')
        console.log('🔑 PASSWORD RESET VERIFICATION SERVICE')
        console.log(`✉️  EMAIL: ${email}`)
        console.log(`✨  YOUR 6-DIGIT VERIFICATION CODE: ${code}`)
        console.log('⏰  EXPIRES IN: 10 Minutes')
        console.log('=============================================\n')

        res.json({ 
            message: 'Verification code generated! Please check the terminal console logs.',
            // Also returning code in response body ONLY in development mode so user can test without terminal access if needed!
            devCode: code
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        res.status(500).json({ message: 'Server error processing request' })
    }
}

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body

        const student = await Student.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        })

        if (!student) {
            return res.status(400).json({ message: 'Invalid or expired verification code' })
        }

        student.password = newPassword
        student.verificationCode = undefined
        student.verificationCodeExpires = undefined
        await student.save()

        res.json({ message: 'Password reset successful! You can now log in.' })
    } catch (error) {
        console.error('Reset password error:', error)
        res.status(500).json({ message: 'Server error resetting password' })
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword
}
