const Material = require('../models/Material')
const path = require('path')
const fs = require('fs')

// Seed default materials
const seedMaterials = async () => {
    const count = await Material.countDocuments()
    if (count === 0) {
        const uploadDir = path.join(__dirname, '../../uploads')
        
        // Create actual physical files for the default seed materials so download doesn't fail
        const filesToCreate = [
            { name: 'syllabus_computer_science_2026.pdf', content: 'Computer Science Syllabus 2026\nSemester 1, 2, 3 details.' },
            { name: 'data_structures_lecture_notes.pdf', content: 'Data Structures and Algorithms Lecture Notes.\nTopics: Arrays, Linked Lists, Trees, Graphs, Sorting.' },
            { name: 'dbms_query_cheatsheet.txt', content: 'Database Management Systems SQL Query Cheatsheet.\nSELECT, INSERT, UPDATE, JOINs, GROUP BY examples.' }
        ]

        for (const file of filesToCreate) {
            const filePath = path.join(uploadDir, file.name)
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, file.content)
            }
        }

        const defaultMaterials = [
            {
                title: 'B.Tech CS Syllabus 2026',
                subject: 'Computer Science',
                className: 'B.Tech CSE 1st Year',
                fileName: 'syllabus_computer_science_2026.pdf',
                uploadedBy: 'Dr. Rajesh Kumar'
            },
            {
                title: 'Data Structures Complete Lecture Notes',
                subject: 'Data Structures',
                className: 'B.Tech CSE 2nd Year',
                fileName: 'data_structures_lecture_notes.pdf',
                uploadedBy: 'Prof. Sneha Sharma'
            },
            {
                title: 'SQL Commands & Queries Cheatsheet',
                subject: 'DBMS',
                className: 'B.Tech CSE 2nd Year',
                fileName: 'dbms_query_cheatsheet.txt',
                uploadedBy: 'Prof. Sneha Sharma'
            }
        ]
        await Material.insertMany(defaultMaterials)
        console.log('📚 Seeded default study materials successfully')
    }
}

// Get all study materials
const getMaterials = async (req, res) => {
    try {
        await seedMaterials()
        const materials = await Material.find().sort({ createdAt: -1 })
        res.json(materials)
    } catch (error) {
        console.error('Error fetching materials:', error)
        res.status(500).json({ message: 'Server error retrieving materials' })
    }
}

// Upload new material
const uploadMaterial = async (req, res) => {
    try {
        const { title, subject, className } = req.body
        
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' })
        }

        const material = await Material.create({
            title,
            subject,
            className,
            fileName: req.file.filename,
            uploadedBy: req.user ? req.user.name : 'Student'
        })

        res.status(201).json({
            message: 'Study material uploaded successfully!',
            material
        })
    } catch (error) {
        console.error('Error uploading material:', error)
        res.status(500).json({ message: 'Server error uploading file' })
    }
}

// Download material
const downloadMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id)
        if (!material) {
            return res.status(404).json({ message: 'Study material record not found' })
        }

        const filePath = path.join(__dirname, '../../uploads', material.fileName)
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Physical notes file not found on server' })
        }

        res.download(filePath, material.fileName)
    } catch (error) {
        console.error('Error downloading material:', error)
        res.status(500).json({ message: 'Server error downloading file' })
    }
}

module.exports = {
    getMaterials,
    uploadMaterial,
    downloadMaterial
}
