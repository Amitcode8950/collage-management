import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Teachers = () => {
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api/teachers')
                setTeachers(data)
                setLoading(false)
            } catch (err) {
                console.error(err)
                setError('Failed to retrieve faculty directory details.')
                setLoading(false)
            }
        }
        fetchTeachers()
    }, [])

    const getTeacherPlaceholder = (index) => {
        const images = [
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=500', // female prof
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=500', // male prof
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=500', // female math prof
            'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=400&h=500', // male humanities prof
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=500'  // male physics/iot prof
        ]
        return images[index % images.length]
    }

    return (
        <div className="page-container animate-fade-in">
            <section className="section-header animate-fade-in-up">
                <div className="hero-badge">📚 Faculty Directory</div>
                <h1 className="section-title" style={{ fontSize: '3rem', fontWeight: 800 }}>Meet Our Teachers</h1>
                <p className="section-subtitle" style={{ maxWidth: '650px' }}>
                    Learn from world-class researchers, industry pioneers, and supportive mentors committed to fostering academic brilliance.
                </p>
            </section>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    Loading Faculty Profiles...
                </div>
            ) : error ? (
                <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '2rem auto' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{error}</span>
                </div>
            ) : (
                <div className="teachers-grid">
                    {teachers.map((teacher, index) => (
                        <div 
                            key={teacher._id || index} 
                            className="teacher-card glass-panel animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="teacher-img-wrapper">
                                <img 
                                    src={getTeacherPlaceholder(index)} 
                                    alt={teacher.name} 
                                    className="teacher-img"
                                />
                            </div>
                            <div className="teacher-info">
                                <h3 className="teacher-name">{teacher.name}</h3>
                                <div className="teacher-dept">{teacher.department}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.75rem' }}>
                                    {teacher.designation}
                                </div>
                                <p className="teacher-desc">{teacher.bio}</p>
                                
                                <div className="teacher-email">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>{teacher.email || `${teacher.name.toLowerCase().replace(/\s+/g, '.')}@college.edu`}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Teachers
