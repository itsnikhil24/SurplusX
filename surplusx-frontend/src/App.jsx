import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage.jsx'
import LoginPage from './LoginPage.jsx'
import Dashboard from './Dashboard.jsx'
import Upload from './SurplusDashboard.jsx'
import Marketplace from './Marketplace.jsx'
import Impact from './Impact.jsx'
import NGOAllocation from './NGOAllocation.jsx'
import HungerMap from './HungerMap.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/uploadsurplus" element={
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      } />

      <Route path="/marketplace" element={
        <ProtectedRoute>
          <Marketplace />
        </ProtectedRoute>
      } />

      <Route path="/impactdashboard" element={
        <ProtectedRoute>
          <Impact />
        </ProtectedRoute>
      } />

      <Route path="/ngo-allocation" element={
        <ProtectedRoute>
          <NGOAllocation />
        </ProtectedRoute>
      } />

      <Route path="/hunger-map" element={
        <ProtectedRoute>
          <HungerMap />
        </ProtectedRoute>
      } />
    </Routes>
  )
}