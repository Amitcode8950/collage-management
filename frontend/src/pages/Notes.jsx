import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Notes = () => {
    const [materials, setMaterials] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    // Uploader Modal states
    const [showModal, setShowModal] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [uploadForm, setUploadForm] = useState({
        title: '',
        subject: '',
        className: ''
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [selectedFileName, setSelectedFileName] = useState('Select document (PDF, DOCX, TXT)')

    // Check login context
    const userStr = localStorage.getItem('userInfo')
    const user = userStr ? JSON.parse(userStr) : null

    const fetchMaterials = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/materials')
            setMaterials(data)
            setLoading(false)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch study notes.')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMaterials()
    }, [])

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const handleUploadChange = (e) => {
        setUploadForm({ ...uploadForm, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
            setSelectedFileName(e.target.files[0].name)
        }
    }

    const handleUploadSubmit = async (e) => {
        e.preventDefault()
        setUploadError('')
        setUploadLoading(true)

        if (!selectedFile) {
            setUploadError('Please select a notes document file to upload.')
            setUploadLoading(false)
            return
        }

        try {
            const formData = new FormData()
            formData.append('title', uploadForm.title)
            formData.append('subject', uploadForm.subject)
            formData.append('className', uploadForm.className)
            formData.append('file', selectedFile)

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            }

            await axios.post('http://localhost:8000/api/materials/upload', formData, config)
            
            setUploadLoading(false)
            setShowModal(false)
            setMessage('Notes file uploaded successfully!')
            
            // Reset Form
            setUploadForm({ title: '', subject: '', className: '' })
            setSelectedFile(null)
            setSelectedFileName('Select document (PDF, DOCX, TXT)')
            
            // Reload Notes
            fetchMaterials()
        } catch (err) {
            setUploadLoading(false)
            setUploadError(err.response && err.response.data.message ? err.response.data.message : 'Error uploading note document.')
        }
    }

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase()
        if (ext === 'pdf') return '📕'
        if (['doc', 'docx'].includes(ext)) return '📘'
        if (ext === 'txt') return '📄'
        return '📁'
    }

    // Filter notes dynamically
    const filteredMaterials = materials.filter(note => {
        const query = search.toLowerCase()
        return (
            note.title.toLowerCase().includes(query) ||
            note.subject.toLowerCase().includes(query) ||
            note.className.toLowerCase().includes(query) ||
            note.uploadedBy.toLowerCase().includes(query)
        )
    })

    return (
        <div className="page-container animate-fade-in">
            {/* Header Section */}
            <section className="section-header animate-fade-in-up">
                <div className="hero-badge">📖 Academic Archive</div>
                <h1 className="section-title" style={{ fontSize: '3rem', fontWeight: 800 }}>E-Study Library</h1>
                <p className="section-subtitle" style={{ maxWidth: '650px' }}>
                    Access, download, and share high-quality syllabi, course slides, and reading logs curated by students and professors.
                </p>
            </section>

            {message && (
                <div className="alert alert-success animate-fade-in" style={{ maxWidth: '600px', margin: '1rem auto 2rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{message}</span>
                </div>
            )}

            {/* Filter and Upload action bar */}
            <div className="materials-top animate-fade-in-up">
                <div className="search-bar-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search by title, subject, or author..." 
                        className="form-control search-bar" 
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                {user ? (
                    <button onClick={() => { setShowModal(true); setMessage(''); }} className="btn btn-primary">
                        ➕ Upload Study Notes
                    </button>
                ) : (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        🔐 Log in as a student to upload study notes.
                    </div>
                )}
            </div>

            {/* Notes Cards Listing */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    Loading Notes Catalog...
                </div>
            ) : error ? (
                <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '2rem auto' }}>
                    <span>{error}</span>
                </div>
            ) : filteredMaterials.length === 0 ? (
                <div className="empty-state glass-panel animate-fade-in-up">
                    <div className="empty-icon">📂</div>
                    <h3>No Notes Found</h3>
                    <p>Try searching for a different keyword or upload the first document!</p>
                </div>
            ) : (
                <div className="notes-grid">
                    {filteredMaterials.map((note, index) => (
                        <div 
                            key={note._id || index} 
                            className="note-card glass-panel animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <div className="note-header">
                                <div className="note-file-icon">
                                    {getFileIcon(note.fileName)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h3 className="note-title">{note.title}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                                        {note.subject}
                                    </span>
                                </div>
                            </div>

                            <div className="note-meta">
                                <span className="note-tag class">{note.className}</span>
                                <span className="note-tag">Author: {note.uploadedBy}</span>
                            </div>

                            <div className="note-details">
                                <span>Uploaded {new Date(note.createdAt).toLocaleDateString()}</span>
                                <a 
                                    href={`http://localhost:8000/api/materials/download/${note._id}`}
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', textDecoration: 'none' }}
                                    download
                                >
                                    📥 Download Notes
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal Popup */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.4rem' }}>Upload Study Notes</h3>
                            <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
                        </div>

                        {uploadError && (
                            <div className="alert alert-danger" style={{ padding: '0.6rem 1rem', marginBottom: '1rem' }}>
                                <span>{uploadError}</span>
                            </div>
                        )}

                        <form onSubmit={handleUploadSubmit} encType="multipart/form-data">
                            <div className="form-group">
                                <label htmlFor="title">Document Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    placeholder="e.g. Unit 3 Trees & Graphs Study Guide"
                                    value={uploadForm.title}
                                    onChange={handleUploadChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject Name</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="form-control"
                                    placeholder="e.g. Data Structures"
                                    value={uploadForm.subject}
                                    onChange={handleUploadChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="className">Target Class / Branch</label>
                                <input
                                    type="text"
                                    id="className"
                                    name="className"
                                    className="form-control"
                                    placeholder="e.g. B.Tech CSE 2nd Year"
                                    value={uploadForm.className}
                                    onChange={handleUploadChange}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label>Notes Document Attachment</label>
                                <div className="file-input-wrapper">
                                    <button type="button" className="file-input-btn">Upload Doc</button>
                                    <span className="file-input-name">{selectedFileName}</span>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={uploadLoading}
                                >
                                    {uploadLoading ? 'Uploading document...' : 'Publish Study Notes'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notes
