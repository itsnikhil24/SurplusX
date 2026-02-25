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
  const [stats, setStats] = useState({
    mealsSaved: 24850,
    revenue: "₹4.2L",
    donations: 1840,
    restaurants: 156,
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🔥 typewriter state
  const fullText = "Welcome to SurplusX 👋";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // future API hook
  }, []);

  return (
    <div className="dashboard">
      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">🍽️ {sidebarOpen && "SurplusX"}</div>
        </div>

        <nav className="sidebar-menu">
          <a className="active">
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </a>

          <a>
            <Upload size={20} />
            {sidebarOpen && <span>Upload Surplus</span>}
          </a>

          <a>
            <Store size={20} />
            {sidebarOpen && <span>Marketplace</span>}
          </a>

          <a>
            <Users size={20} />
            {sidebarOpen && <span>NGO Allocation</span>}
          </a>

          <a>
            <BarChart3 size={20} />
            {sidebarOpen && <span>Impact Dashboard</span>}
          </a>

          <a>
            <Map size={20} />
            {sidebarOpen && <span>Hunger Map</span>}
          </a>
        </nav>

        <div className="logout">
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
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
            <Menu size={20} />
          </button>
        </div>

        {/* Welcome */}
        <div className="welcome">
          <h1 className="typewriter">{typedText}</h1>
          <p>Optimizing Profit, Minimizing Hunger</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <Package />
            <h2>{stats.mealsSaved}</h2>
            <span>Meals Saved</span>
          </div>

          <div className="stat-card glass">
            <TrendingUp />
            <h2>{stats.revenue}</h2>
            <span>Revenue Generated</span>
          </div>

          <div className="stat-card glass">
            <Heart />
            <h2>{stats.donations}</h2>
            <span>Donations Delivered</span>
          </div>

          <div className="stat-card glass">
            <Truck />
            <h2>{stats.restaurants}</h2>
            <span>Active Restaurants</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="bottom-grid">
          <div className="quick-card glass">
            <h3>Quick Actions</h3>
            <button className="primary-btn">Upload Surplus →</button>
            <button className="secondary-btn">View Marketplace →</button>
            <button className="secondary-btn">Impact Report →</button>
          </div>

          <div className="recent-card glass">
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