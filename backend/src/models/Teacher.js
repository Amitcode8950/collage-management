const mongoose = require('mongoose')

const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    image: { type: String }, // URL/Path to image
    bio: { type: String },
    email: { type: String }
}, {
    timestamps: true
})

module.exports = mongoose.model('Teacher', TeacherSchema)
