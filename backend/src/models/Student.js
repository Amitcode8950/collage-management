const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const FeeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['paid', 'due'], default: 'due' },
    paidAt: { type: Date }
})

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    className: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String }, // Path or URL to uploaded profile photo
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    fees: { type: [FeeSchema], default: [] }
}, {
    timestamps: true
})

// Hash password before saving
StudentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Compare password
StudentSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('Student', StudentSchema)
