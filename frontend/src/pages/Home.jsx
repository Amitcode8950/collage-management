import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const user = localStorage.getItem('userInfo')

    return (
        <div className="page-container animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content animate-fade-in-up">
                    <div className="hero-badge">🎓 Welcome to Aura College Portal</div>
                    <h1 className="hero-title">
                        Empowering Minds, <br />
                        Shaping <span>Bright Futures</span>
                    </h1>
                    <p className="hero-desc">
                        A modern, interactive ecosystem for students and faculty. Access your profile, track academic fees, access notes, and communicate with expert teachers in one centralized hub.
                    </p>
                    <div className="hero-actions">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary">Go to Student Portal</Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary">Get Started</Link>
                                <Link to="/login" className="btn btn-secondary">Student Login</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-glow"></div>
                    <div className="hero-box glass-panel">
                        <div className="hero-logo-large">🏫</div>
                        <div className="hero-box-text">AURA ACADEMY</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '0 2rem' }}>
                            Next-gen digital infrastructure for higher education and academic collaboration.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header animate-fade-in-up">
                    <h2 className="section-title">Centralized College Features</h2>
                    <p className="section-subtitle">Everything you need to succeed in your academic journey, right at your fingertips.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="feature-icon">👤</div>
                        <h3 className="feature-title">Student Dashboard</h3>
                        <p className="feature-desc">
                            Easily manage your academic registry details, view father's name, class, roll number, phone, and update your profile photo instantly.
                        </p>
                    </div>

                    <div className="feature-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="feature-icon">💸</div>
                        <h3 className="feature-title">Fees & Transactions</h3>
                        <p className="feature-desc">
                            Transparent invoice system. Track pending and paid fees for tuition, library access, examinations, and make simulated instant online payments.
                        </p>
                    </div>

                    <div className="feature-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="feature-icon">📚</div>
                        <h3 className="feature-title">E-Study Notes</h3>
                        <p className="feature-desc">
                            Access syllabus guides, lecture slideshows, and text cheatsheets. Upload helpful materials for peers or download existing resources instantly.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
