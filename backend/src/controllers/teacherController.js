const Teacher = require('../models/Teacher')

// Seed Teachers if none exist
const seedTeachers = async () => {
    const count = await Teacher.countDocuments()
    if (count === 0) {
        const dummyTeachers = [
            {
                name: 'Dr. Rajesh Kumar',
                designation: 'HOD & Senior Professor',
                department: 'Computer Science & Engineering',
                image: 'teacher1.jpg',
                bio: 'Ph.D. in AI/ML from IIT. 15+ years of research and teaching experience in Artificial Intelligence, Computer Vision, and Cloud Networks.',
                email: 'rajesh.kumar@college.edu'
            },
            {
                name: 'Prof. Sneha Sharma',
                designation: 'Associate Professor',
                department: 'Information Technology',
                image: 'teacher2.jpg',
                bio: 'M.Tech in Software Engineering. Specializes in Web Technologies, Distributed Architectures, and Database Design.',
                email: 'sneha.sharma@college.edu'
            },
            {
                name: 'Dr. Amit Patel',
                designation: 'Assistant Professor',
                department: 'Mathematics & Computing',
                image: 'teacher3.jpg',
                bio: 'Ph.D. in Applied Mathematics. Specialized in Cryptography, Advanced Calculus, and Discrete Mathematical Structures.',
                email: 'amit.patel@college.edu'
            },
            {
                name: 'Mrs. Anjali Desai',
                designation: 'Senior Lecturer',
                department: 'Humanities & Communication',
                image: 'teacher4.jpg',
                bio: 'Expert in Professional Writing, Technical English, Soft Skills, and student placements training.',
                email: 'anjali.desai@college.edu'
            },
            {
                name: 'Dr. Vikram Malhotra',
                designation: 'Professor',
                department: 'Electronics & Communication',
                image: 'teacher5.jpg',
                bio: 'Ph.D. in Embedded Systems. Pioneer in IoT systems, VLSI Design, and Microcontrollers research.',
                email: 'vikram.malhotra@college.edu'
            }
        ]
        await Teacher.insertMany(dummyTeachers)
        console.log('📚 Seeded default teachers in DB successfully')
    }
}

// Get all teachers
const getTeachers = async (req, res) => {
    try {
        await seedTeachers()
        const teachers = await Teacher.find()
        res.json(teachers)
    } catch (error) {
        console.error('Error fetching teachers:', error)
        res.status(500).json({ message: 'Server error retrieving teachers' })
    }
}

module.exports = {
    getTeachers
}
