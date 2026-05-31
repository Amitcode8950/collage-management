const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
    }
})

// File filter (accept images and docs)
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx|txt|ppt|pptx|zip/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname || mimetype) {
        return cb(null, true)
    } else {
        cb(new Error('Only images, PDFs, Word, PowerPoint, zip and text files are allowed!'), false)
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
})

module.exports = upload
