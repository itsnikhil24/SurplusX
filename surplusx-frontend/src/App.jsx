import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../src/LandingPage.jsx'
import LoginPage from '../src/LoginPage.jsx'
import Dashboard from '../src/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
     <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
