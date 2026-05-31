import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [fees, setFees] = useState([])
    const [activeTab, setActiveTab] = useState('fees') // 'fees' or 'edit-profile'
    const [editForm, setEditForm] = useState({
        name: '',
        fatherName: '',
        className: '',
        rollNo: '',
        phoneNo: '',
        email: '',
        password: ''
    })
    const [newImage, setNewImage] = useState(null)
    const [newImageName, setNewImageName] = useState('Change profile image (Optional)')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Load user profile & fees info
    const loadProfile = async () => {
        const userInfo = localStorage.getItem('userInfo')
        if (!userInfo) {
            navigate('/login')
            return
        }

        const parsedUser = JSON.parse(userInfo)
        setUser(parsedUser)
        setFees(parsedUser.fees || [])

        // Prepopulate edit form fields
        setEditForm({
            name: parsedUser.name || '',
            fatherName: parsedUser.fatherName || '',
            className: parsedUser.className || '',
            rollNo: parsedUser.rollNo || '',
            phoneNo: parsedUser.phoneNo || '',
            email: parsedUser.email || '',
            password: ''
        })

        // Fetch fresh data from backend
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${parsedUser.token}`
                }
            }
            const { data } = await axios.get('http://localhost:8000/api/auth/profile', config)
            // Preserve token
            const updatedUser = { ...data, token: parsedUser.token }
            localStorage.setItem('userInfo', JSON.stringify(updatedUser))
            setUser(updatedUser)
            setFees(updatedUser.fees || [])
        } catch (err) {
            console.error('Failed to reload profile details:', err)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0])
            setNewImageName(e.target.files[0].name)
        }
    }

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value })
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('name', editForm.name)
            formData.append('fatherName', editForm.fatherName)
            formData.append('className', editForm.className)
            formData.append('rollNo', editForm.rollNo)
            formData.append('phoneNo', editForm.phoneNo)
            formData.append('email', editForm.email)
            if (editForm.password) {
                formData.append('password', editForm.password)
            }
            if (newImage) {
                formData.append('image', newImage)
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('http://localhost:8000/api/auth/profile', formData, config)
            const updatedUser = { ...data, token: user.token }
            localStorage.setItem('userInfo', JSON.stringify(updatedUser))
            setUser(updatedUser)
            setFees(updatedUser.fees || [])
            setNewImage(null)
            setNewImageName('Change profile image (Optional)')
            setLoading(false)
            setMessage('Profile updated successfully!')
            setActiveTab('fees')
        } catch (err) {
            setLoading(false)
            setError(err.response && err.response.data.message ? err.response.data.message : 'Failed to update profile.')
        }
    }

    const handlePayFee = async (feeId) => {
        setError('')
        setMessage('')

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('http://localhost:8000/api/fees/pay', { feeId }, config)
            
            // Update storage user fees
            const updatedUser = { ...user, fees: data.fees }
            localStorage.setItem('userInfo', JSON.stringify(updatedUser))
            setUser(updatedUser)
            setFees(data.fees)
            setMessage('Payment simulated successfully! Receipt generated.')
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : 'Payment simulation failed.')
        }
    }

    if (!user) return <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>Loading Student Console...</div>

    // Calculations for fees dashboard
    const totalDue = fees.reduce((sum, item) => item.status === 'due' ? sum + item.amount : sum, 0)
    const totalPaid = fees.reduce((sum, item) => item.status === 'paid' ? sum + item.amount : sum, 0)

    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'
        return `http://localhost:8000/uploads/${imageName}`
    }

    return (
        <div className="page-container animate-fade-in">
            <div className="dashboard-grid">
                
                {/* Profile Sidebar */}
                <div className="profile-card glass-panel animate-fade-in-up">
                    <div className="profile-avatar-wrapper">
                        <img 
                            src={getImageUrl(user.image)} 
                            alt={user.name} 
                            className="profile-avatar"
                        />
                    </div>
                    <h3 className="profile-name">{user.name}</h3>
                    <span className="profile-roll">{user.rollNo}</span>

                    <ul className="profile-details-list">
                        <li className="profile-detail-item">
                            <span className="detail-label">Father's Name</span>
                            <span className="detail-value">{user.fatherName}</span>
                        </li>
                        <li className="profile-detail-item">
                            <span className="detail-label">Class / Program</span>
                            <span className="detail-value">{user.className}</span>
                        </li>
                        <li className="profile-detail-item">
                            <span className="detail-label">Phone Number</span>
                            <span className="detail-value">{user.phoneNo}</span>
                        </li>
                        <li className="profile-detail-item">
                            <span className="detail-label">Email Address</span>
                            <span className="detail-value">{user.email}</span>
                        </li>
                    </ul>

                    <button 
                        onClick={() => setActiveTab(activeTab === 'edit-profile' ? 'fees' : 'edit-profile')} 
                        className={`btn ${activeTab === 'edit-profile' ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ width: '100%' }}
                    >
                        {activeTab === 'edit-profile' ? 'View Academic Fees' : 'Update Profile Info'}
                    </button>
                </div>

                {/* Dashboard Operations Area */}
                <div className="dashboard-content">
                    
                    {error && (
                        <div className="alert alert-danger animate-fade-in">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="alert alert-success animate-fade-in">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span>{message}</span>
                        </div>
                    )}

                    <div className="tab-nav">
                        <button 
                            onClick={() => setActiveTab('fees')} 
                            className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
                        >
                            Academic Fee Invoices
                        </button>
                        <button 
                            onClick={() => setActiveTab('edit-profile')} 
                            className={`tab-btn ${activeTab === 'edit-profile' ? 'active' : ''}`}
                        >
                            Settings & Updates
                        </button>
                    </div>

                    {activeTab === 'fees' ? (
                        <div className="animate-fade-in-up">
                            
                            {/* Summary Cards */}
                            <div className="fees-summary-cards">
                                <div className="fees-summary-card glass-panel">
                                    <div className="fees-summary-icon due">💸</div>
                                    <div className="fees-summary-info">
                                        <div className="fees-summary-label">Total Outstandings</div>
                                        <div className="fees-summary-value" style={{ color: 'var(--warning)' }}>
                                            ₹ {totalDue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="fees-summary-card glass-panel">
                                    <div className="fees-summary-icon paid">✨</div>
                                    <div className="fees-summary-info">
                                        <div className="fees-summary-label">Total Settled</div>
                                        <div className="fees-summary-value" style={{ color: 'var(--success)' }}>
                                            ₹ {totalPaid.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Invoices List */}
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <div className="fees-header">
                                    <h3 style={{ fontSize: '1.25rem' }}>Billing Log</h3>
                                </div>

                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Fee Description</th>
                                                <th>Amount</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'right' }}>Payment Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fees.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                                        No invoice details generated for this account.
                                                    </td>
                                                </tr>
                                            ) : (
                                                fees.map((item) => (
                                                    <tr key={item._id}>
                                                        <td style={{ fontWeight: 600 }}>{item.title}</td>
                                                        <td>₹ {item.amount.toLocaleString()}</td>
                                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                            {new Date(item.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </td>
                                                        <td>
                                                            <span className={`status-badge ${item.status}`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ textAlign: 'right' }}>
                                                            {item.status === 'due' ? (
                                                                <button 
                                                                    onClick={() => handlePayFee(item._id)} 
                                                                    className="btn btn-accent btn-sm"
                                                                    style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                                                                >
                                                                    Pay Outstanding
                                                                </button>
                                                            ) : (
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                                                                    Paid {new Date(item.paidAt).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="glass-panel animate-fade-in-up" style={{ padding: '2.5rem', textAlign: 'left' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Update Personal Information</h3>
                            
                            <form onSubmit={handleUpdateProfile} encType="multipart/form-data">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="form-control"
                                            value={editForm.name}
                                            onChange={handleEditChange}
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
                                            value={editForm.fatherName}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="className">Class / Degree</label>
                                        <input
                                            type="text"
                                            id="className"
                                            name="className"
                                            className="form-control"
                                            value={editForm.className}
                                            onChange={handleEditChange}
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
                                            value={editForm.rollNo}
                                            onChange={handleEditChange}
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
                                            value={editForm.phoneNo}
                                            onChange={handleEditChange}
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
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Change Password (Leave blank to keep current)</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={editForm.password}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label>Change Profile Avatar</label>
                                    <div className="file-input-wrapper">
                                        <button type="button" className="file-input-btn">Upload Avatar</button>
                                        <span className="file-input-name">{newImageName}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving updates...' : 'Save Profile Changes'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setActiveTab('fees')}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}

export default Dashboard
