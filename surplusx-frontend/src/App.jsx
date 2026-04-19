import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../src/LandingPage.jsx'
import LoginPage from '../src/LoginPage.jsx'
import Dashboard from '../src/Dashboard.jsx'
import Upload from './SurplusDashboard.jsx'
import Marketplace from '../src/Marketplace.jsx'
import Impact from '../src/Impact.jsx'
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