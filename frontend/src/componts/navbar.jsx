import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const userStr = localStorage.getItem('userInfo')
    const user = userStr ? JSON.parse(userStr) : null

    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        navigate('/login')
    }

    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'
        return `http://localhost:8000/uploads/${imageName}`
    }

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                </svg>
                <span>Aura<span>College</span></span>
            </Link>

            <div className="navigation">
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/teachers" className={({ isActive }) => isActive ? 'active' : ''}>Teachers</NavLink>
                    </li>
                    <li>
                        <NavLink to="/notes" className={({ isActive }) => isActive ? 'active' : ''}>E-Study Notes</NavLink>
                    </li>
                    {user && (
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Student Portal</NavLink>
                        </li>
                    )}
                </ul>
            </div>

            <div className="nav-buttons">
                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-profile-badge">
                            <img 
                                src={getImageUrl(user.image)} 
                                alt={user.name} 
                                className="nav-avatar" 
                            />
                            <span className="nav-username">{user.name}</span>
                        </Link>
                        <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar