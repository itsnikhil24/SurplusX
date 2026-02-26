import React, { useState } from "react";
import { motion } from 'framer-motion';
import { 
  Menu, BarChart3, Leaf, Utensils, Building2, Heart, TrendingUp,
  LayoutDashboard, Upload, Store, Users, Map, LogOut
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', meals: 1200, kg: 450 },
  { month: 'Feb', meals: 1800, kg: 620 },
  { month: 'Mar', meals: 2100, kg: 780 },
  { month: 'Apr', meals: 2800, kg: 920 },
  { month: 'May', meals: 3400, kg: 1100 },
  { month: 'Jun', meals: 4200, kg: 1350 },
];

const splitData = [
  { name: 'Sold', value: 42 },
  { name: 'Donated', value: 58 },
];

const pieColors = ['#f58220', '#1f7a49'];

const stats = [
  { label: 'Total Meals Saved', value: '12,345', icon: Utensils, color: '#f58220' },
  { label: 'Kg Redistributed', value: '6,789', icon: TrendingUp, color: '#edc22b' },
  { label: 'CO₂ Prevented (kg)', value: '3,210', icon: Leaf, color: '#1f7a49' },
  { label: 'Restaurants Active', value: '58', icon: Building2, color: '#f58220' },
  { label: 'NGOs Connected', value: '24', icon: Heart, color: '#edc22b' },
  { label: 'Cities Covered', value: '12', icon: BarChart3, color: '#1f7a49' },
];

export default function ImpactDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("impact");

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f9fa' }}>
      
      {/* ===== Sidebar (exactly like Dashboard) ===== */}
      <aside style={{
        width: sidebarOpen ? 260 : 80,
        backgroundColor: '#0b2216',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        transition: 'width 0.3s',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '0 24px 40px' }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🍽️ {sidebarOpen && "SurplusX"}
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { key: "upload", label: "Upload Surplus", icon: Upload },
            { key: "marketplace", label: "Marketplace", icon: Store },
            { key: "ngo", label: "NGO Allocation", icon: Users },
            { key: "impact", label: "Impact Dashboard", icon: BarChart3 },
           
          ].map((item) => (
            <a
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontWeight: activeMenu === item.key ? 600 : 400,
                backgroundColor: activeMenu === item.key ? '#1a3a2a' : 'transparent',
                borderLeft: activeMenu === item.key ? '4px solid #f58220' : '4px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '24px',
          borderTop: '1px solid #1a3a2a',
          cursor: 'pointer'
        }}>
        
              <div className="logout" onClick={() => (window.location.href = "/")}>
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </div>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', height: '60px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '4px' }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* ==== Impactful Page Heading ==== */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          background: 'linear-gradient(90deg, #1f7a49, #f58220)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          letterSpacing: '1px'
        }}>
          Impact Dashboard
        </h1>
        <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '32px' }}>
          Visualize the impact of our efforts in reducing food wastage and hunger.
        </p>

        {/* Stats Grid - 3 per row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: '#fff',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #eaedf0',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <s.icon size={24} style={{ color: '#fff' }} />
              </div>
              <div>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a1a1a' }}>{s.value}</p>
                <p style={{ fontSize: '0.85rem', color: '#4a5568' }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
          
          {/* LineChart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              flex: '2',
              minWidth: '300px',
              background: '#fff',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #eaedf0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
            }}
          >
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '16px', color: '#1a1a1a' }}>Monthly Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#1a1a1a" />
                <YAxis tick={{ fontSize: 12 }} stroke="#1a1a1a" />
                <Tooltip />
                <Line type="monotone" dataKey="meals" stroke="#1f7a49" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="kg" stroke="#f58220" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* PieChart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{
              flex: '1',
              minWidth: '220px',
              background: '#fff',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #eaedf0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
            }}
          >
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '16px', color: '#1a1a1a' }}>Sell vs Donate Split</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={splitData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {splitData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {splitData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#4a5568', fontWeight: 500 }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: pieColors[i] }} />
                  {d.name} ({d.value}%)
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}