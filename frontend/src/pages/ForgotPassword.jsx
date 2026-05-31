import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1: Email, 2: Verification Code & Password
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    const [devMessage, setDevMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Request verification code
    const handleSendCode = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        try {
            const { data } = await axios.post('http://localhost:8000/api/auth/forgot-password', { email })
            setLoading(false)
            setMessage(data.message)
            // Save dev code if returned to help users test without looking at server terminal logs
            if (data.devCode) {
                setDevMessage(`[Development Mode Check] Auto-retrieved verification code: ${data.devCode}`)
            }
            setStep(2)
        } catch (err) {
            setLoading(false)
            setError(err.response && err.response.data.message ? err.response.data.message : 'Failed to request verification code.')
        }
    }

    // Submit new password
    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { data } = await axios.post('http://localhost:8000/api/auth/reset-password', {
                email,
                code,
                newPassword
            })
            setLoading(false)
            setMessage(data.message)
            setDevMessage('')
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err) {
            setLoading(false)
            setError(err.response && err.response.data.message ? err.response.data.message : 'Invalid code or password reset failed.')
        }
    }

    return (
        <div className="page-container animate-fade-in">
            <div className="form-card glass-panel animate-fade-in-up">
                <h2 className="form-title">Reset Security Password</h2>
                <p className="form-subtitle">
                    {step === 1 ? 'Enter your email to receive a recovery code' : 'Submit verification code and set your new password'}
                </p>

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

                {message && (
                    <div className="alert alert-success">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>{message}</span>
                    </div>
                )}

                {devMessage && (
                    <div className="alert" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>{devMessage}</span>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendCode}>
                        <div className="form-group">
                            <label htmlFor="email">Registered Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="you@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending code...' : 'Generate Verification Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label htmlFor="code">6-Digit Verification Code</label>
                            <input
                                type="text"
                                id="code"
                                className="form-control"
                                placeholder="Enter code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                maxLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                placeholder="Choose a secure password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Resetting password...' : 'Update Password'}
                        </button>
                    </form>
                )}

                <div className="form-footer">
                    Back to <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
