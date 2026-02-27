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
import "leaflet/dist/leaflet.css";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/uploadsurplus" element={<Upload />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/impactdashboard" element={<Impact />} />
      <Route path="/ngo-allocation" element={<NGOAllocation />} />
      <Route path="/hunger-map" element={<HungerMap />} />
    </Routes>
  )
}
