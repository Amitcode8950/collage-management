import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        className: '',
        rollNo: '',
        phoneNo: '',
        email: '',
        password: ''
    })
    const [image, setImage] = useState(null)
    const [imageName, setImageName] = useState('No image selected (Optional)')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
            setImageName(e.target.files[0].name)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = new FormData()
            data.append('name', formData.name)
            data.append('fatherName', formData.fatherName)
            data.append('className', formData.className)
            data.append('rollNo', formData.rollNo)
            data.append('phoneNo', formData.phoneNo)
            data.append('email', formData.email)
            data.append('password', formData.password)
            if (image) {
                data.append('image', image)
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const response = await axios.post(
                'http://localhost:8000/api/auth/register',
                data,
                config
            )

            localStorage.setItem('userInfo', JSON.stringify(response.data))
            setLoading(false)
            navigate('/dashboard')
            window.location.reload()
        } catch (err) {
            setLoading(false)
            setError(err.response && err.response.data.message ? err.response.data.message : 'Registration failed. Try again.')
        }
    }

    return (
        <div className="page-container animate-fade-in">
            <div className="form-card glass-panel animate-fade-in-up" style={{ maxWidth: '650px' }}>
                <h2 className="form-title">Student Registration</h2>
                <p className="form-subtitle">Create your digital profile to join Aura College</p>

                {error && (
                    <div className="alert alert-danger">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fatherName">Father's Name</label>
                            <input
                                type="text"
                                id="fatherName"
                                name="fatherName"
                                className="form-control"
                                placeholder="Robert Doe"
                                value={formData.fatherName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="className">Class / Program</label>
                            <input
                                type="text"
                                id="className"
                                name="className"
                                className="form-control"
                                placeholder="B.Tech CSE (Year 2)"
                                value={formData.className}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="rollNo">Roll Number</label>
                            <input
                                type="text"
                                id="rollNo"
                                name="rollNo"
                                className="form-control"
                                placeholder="CSE-2026-054"
                                value={formData.rollNo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phoneNo">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNo"
                                name="phoneNo"
                                className="form-control"
                                placeholder="+91 9876543210"
                                value={formData.phoneNo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="johndoe@college.edu"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Security Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="At least 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label>Profile Image (Optional)</label>
                        <div className="file-input-wrapper">
                            <button type="button" className="file-input-btn">Choose File</button>
                            <span className="file-input-name">{imageName}</span>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="form-footer">
                    Already registered? <Link to="/login">Log in here</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
