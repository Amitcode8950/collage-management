const mongoose = require('mongoose')

const MaterialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    fileName: { type: String, required: true }, // Saved file path/name
    uploadedBy: { type: String, default: 'Admin' }
}, {
    timestamps: true
})

module.exports = mongoose.model('Material', MaterialSchema)
