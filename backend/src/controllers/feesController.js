const Student = require('../models/Student')

// Get Fees Status
const getFees = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id)
        if (!student) {
            return res.status(404).json({ message: 'Student not found' })
        }
        res.json(student.fees)
    } catch (error) {
        console.error('Fetch fees error:', error)
        res.status(500).json({ message: 'Server error retrieving fees' })
    }
}

// Pay Fee Item (Simulation)
const payFee = async (req, res) => {
    try {
        const { feeId } = req.body
        const student = await Student.findById(req.user._id)
        if (!student) {
            return res.status(404).json({ message: 'Student not found' })
        }

        const fee = student.fees.id(feeId)
        if (!fee) {
            return res.status(404).json({ message: 'Fee record not found' })
        }

        if (fee.status === 'paid') {
            return res.status(400).json({ message: 'This fee is already paid' })
        }

        fee.status = 'paid'
        fee.paidAt = new Date()

        await student.save()
        res.json({ message: 'Fee paid successfully', fees: student.fees })
    } catch (error) {
        console.error('Fee payment error:', error)
        res.status(500).json({ message: 'Server error making payment' })
    }
}

module.exports = {
    getFees,
    payFee
}
