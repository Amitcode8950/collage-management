import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './componts/navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Teachers from './pages/Teachers'
import Notes from './pages/Notes'
import NotFound from './pages/404'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App