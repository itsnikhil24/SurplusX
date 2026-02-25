import React, { useEffect, useState } from "react";
import "../src/styles/Dashboard.css";
import {
  Menu,
  Package,
  TrendingUp,
  Heart,
  Truck,
  LayoutDashboard,
  Upload,
  Store,
  Users,
  BarChart3,
  Map,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  // 🔥 Backend-ready state (API can replace easily)
  const [stats, setStats] = useState({
    mealsSaved: 24850,
    revenue: "₹4.2L",
    donations: 1840,
    restaurants: 156,
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ Backend can replace this with real API call
  useEffect(() => {
    // Example future API:
    // fetch("/api/dashboard").then(res => res.json()).then(setStats)
  }, []);

  return (
    <div className={`dashboard ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo">🍽️ SurplusX</div>
        </div>

        <nav className="sidebar-menu">
          <a className="active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>

          <a>
            <Upload size={18} />
            <span>Upload Surplus</span>
          </a>

          <a>
            <Store size={18} />
            <span>Marketplace</span>
          </a>

          <a>
            <Users size={18} />
            <span>NGO Allocation</span>
          </a>

          <a>
            <BarChart3 size={18} />
            <span>Impact Dashboard</span>
          </a>

          <a>
            <Map size={18} />
            <span>Hunger Map</span>
          </a>
        </nav>

        <div className="logout">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="main">
        {/* Top Bar */}
        <div className="topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Welcome Section */}
        <div className="welcome">
          <h1>Welcome to SurplusX 👋</h1>
          <p>Optimizing Profit, Minimizing Hunger</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <Package />
            <h2>{stats.mealsSaved}</h2>
            <span>Meals Saved</span>
          </div>

          <div className="stat-card">
            <TrendingUp />
            <h2>{stats.revenue}</h2>
            <span>Revenue Generated</span>
          </div>

          <div className="stat-card">
            <Heart />
            <h2>{stats.donations}</h2>
            <span>Donations Delivered</span>
          </div>

          <div className="stat-card">
            <Truck />
            <h2>{stats.restaurants}</h2>
            <span>Active Restaurants</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bottom-grid">
          <div className="quick-card">
            <h3>Quick Actions</h3>

            <button className="primary-btn">Upload Surplus →</button>
            <button className="secondary-btn">View Marketplace →</button>
            <button className="secondary-btn">Impact Report →</button>
          </div>

          <div className="recent-card">
            <h3>Recent Surplus</h3>

            <div className="recent-item">
              <div>
                <b>Rice (Cooked)</b>
                <p>Spice Garden • 2 hours ago</p>
              </div>
              <span className="badge donate">Donate</span>
            </div>

            <div className="recent-item">
              <div>
                <b>Paneer Tikka</b>
                <p>Tandoor House • 1 hour ago</p>
              </div>
              <span className="badge sell">Sell</span>
            </div>

            <div className="recent-item">
              <div>
                <b>Mixed Vegetables</b>
                <p>Green Bowl • 30 min ago</p>
              </div>
              <span className="badge donate">Donate</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}