import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="page-container animate-fade-in">
            <div className="notfound-container">
                <div className="notfound-error animate-float">404</div>
                <h2 className="notfound-title">Page Out of Bounds</h2>
                <p className="notfound-desc">
                    The academic page you are searching for does not exist or has been relocated by the administration.
                </p>
                <Link to="/" className="btn btn-primary">
                    🏫 Return to Campus
                </Link>
            </div>
        </div>
    )
}

export default NotFound
