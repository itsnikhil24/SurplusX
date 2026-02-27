import React from "react";
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Upload, Store, Heart, BarChart3, Map, LogOut, Leaf, Columns,
  Utensils, Building2, TrendingUp 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import "./styles/SurplusDashboard.css"; // Ensure this matches where your fs- classes are stored

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

const pieColors = ['#f58220', '#2f855a']; // Adjusted green to match your new theme

const stats = [
  { label: 'Total Meals Saved', value: '12,345', icon: Utensils, color: '#f58220' },
  { label: 'Kg Redistributed', value: '6,789', icon: TrendingUp, color: '#edc22b' },
  { label: 'CO₂ Prevented (kg)', value: '3,210', icon: Leaf, color: '#2f855a' },
  { label: 'Restaurants Active', value: '58', icon: Building2, color: '#f58220' },
  { label: 'NGOs Connected', value: '24', icon: Heart, color: '#edc22b' },
  { label: 'Cities Covered', value: '12', icon: BarChart3, color: '#2f855a' },
];

export default function ImpactDashboard() {
  return (
    <div className="fs-layout">
      
      {/* ===== Sidebar ===== */}
      <aside className="fs-sidebar">
        <div className="fs-brand">
          <div className="fs-logo-icon">
            <Leaf size={20} color="#68d391" />
          </div>
          <div className="fs-brand-text">
            <h2>SurplusX</h2>
            <p>Restaurant Portal</p>
          </div>
        </div>

        <div className="fs-nav-group">
          <div className="fs-nav-label">NAVIGATION</div>

          <a href="/dashboard" className="fs-nav-item">
            <LayoutDashboard size={18} /> Dashboard
          </a>

          <a href="/uploadsurplus" className="fs-nav-item">
            <Upload size={18} /> Upload Surplus
          </a>

          <a href="/marketplace" className="fs-nav-item">
            <Store size={18} /> Marketplace
          </a>

          <a href="/ngo-allocation" className="fs-nav-item">
            <Heart size={18} /> NGO Allocation
          </a>

          <a href="/impactdashboard" className="fs-nav-item active">
            <BarChart3 size={18} /> Impact Dashboard
          </a>

          <a href="/hunger-map" className="fs-nav-item">
            <Map size={18} /> Hunger Map
          </a>
        </div>

        <div className="fs-sidebar-bottom">
          <a href="/" className="fs-nav-item" onClick={() => localStorage.removeItem("token")}>
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="fs-main">
        {/* Top Header Bar */}
        <header className="fs-topbar">
          <div className="fs-breadcrumb">
            <Columns size={16} color="#64748b" />
            <span>SurplusX</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="fs-content">
          
          <div className="fs-page-header">
            <h1 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.75rem',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #2f855a, #f58220)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              <BarChart3 size={28} color="#2f855a" strokeWidth={2.5} style={{ flexShrink: 0 }} />
              Impact Dashboard
            </h1>
            <p>Visualize the impact of our efforts in reducing food wastage and hunger.</p>
          </div>

          {/* Stats Grid - 3 per row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                  background: '#ffffff',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <s.icon size={24} style={{ color: '#ffffff' }} />
                </div>
                <div>
                  <p style={{ fontSize: '1.35rem', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>{s.value}</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: '500' }}>{s.label}</p>
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
                background: '#ffffff',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}
            >
              <h3 style={{ fontWeight: '700', fontSize: '1.15rem', marginBottom: '24px', color: '#1e293b', marginTop: 0 }}>Monthly Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="meals" stroke="#2f855a" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="kg" stroke="#f58220" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
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
                minWidth: '280px',
                background: '#ffffff',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}
            >
              <h3 style={{ fontWeight: '700', fontSize: '1.15rem', marginBottom: '16px', color: '#1e293b', marginTop: 0, alignSelf: 'flex-start' }}>Sell vs Donate Split</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={splitData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                    {splitData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '20px', marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                {splitData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: pieColors[i] }} />
                    {d.name} <span style={{ color: '#1e293b' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}