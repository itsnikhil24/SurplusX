import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
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
  LogOut,
} from "lucide-react";

// Helper function to format MongoDB dates into "2 hours ago"
const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " min ago";
  return "Just now";
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth > 768 : true
  );

  const fullText = "Welcome to SurplusX 👋";
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(true);

  // Real data states
  const [stats, setStats] = useState({
    mealsSaved: 0,
    revenue: 0,
    donations: 0,
    restaurants: 0,
  });
  const [recentSurplus, setRecentSurplus] = useState([]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // 🔥 FETCH REAL DATA FROM BACKEND
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Retrieve your auth token (adjust this based on how you store it)
        const token = localStorage.getItem("token"); 
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        };

        // Fetch Stats
        const statsRes = await fetch("http://localhost:3000/api/surplus/dashboard/stats", { headers });
        const statsData = await statsRes.json();
        
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch Recent Surplus
        const recentRes = await fetch("http://localhost:3000/api/surplus/surplus/recent", { headers });
        const recentData = await recentRes.json();
        
        if (recentData.success) {
          setRecentSurplus(recentData.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">🍽️ {sidebarOpen && "SurplusX"}</div>
        </div>

        <nav className="sidebar-menu">
          <Link to="/dashboard" className="active">
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link to="/uploadsurplus">
            <Upload size={20} />
            {sidebarOpen && <span>Upload Surplus</span>}
          </Link>

          <Link to="/marketplace">
            <Store size={20} />
            {sidebarOpen && <span>Marketplace</span>}
          </Link>

          <Link to="/ngo-allocation">
            <Users size={20} />
            {sidebarOpen && <span>NGO Allocation</span>}
          </Link>

          <Link to="/impactdashboard">
            <BarChart3 size={20} />
            {sidebarOpen && <span>Impact Dashboard</span>}
          </Link>
        </nav>

        <div className="logout" onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
        }}>
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="main-content">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
        </div>

        <div className="welcome">
          <h1 className="typewriter">{typedText}</h1>
          <p>Optimizing Profit, Minimizing Hunger</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <Package />
            <h2>{loading ? "..." : stats.mealsSaved.toLocaleString()}</h2>
            <span>Meals Saved (kg)</span>
          </div>

          <div className="stat-card glass">
            <TrendingUp />
            {/* Formatted as Indian Rupees */}
            <h2>{loading ? "..." : `₹${(stats.revenue / 100000).toFixed(1)}L`}</h2>
            <span>Revenue Generated</span>
          </div>

          <div className="stat-card glass">
            <Heart />
            <h2>{loading ? "..." : stats.donations.toLocaleString()}</h2>
            <span>Donations Delivered</span>
          </div>

          <div className="stat-card glass">
            <Truck />
            <h2>{loading ? "..." : stats.restaurants}</h2>
            <span>Active Restaurants</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="bottom-grid">
          <div className="quick-card glass">
            <h3>Quick Actions</h3>
            <button className="primary-btn" onClick={() => navigate("/uploadsurplus")}>
              Upload Surplus →
            </button>
            <button className="secondary-btn" onClick={() => navigate("/marketplace")}>
              View Marketplace →
            </button>
            <button className="secondary-btn" onClick={() => navigate("/impactdashboard")}>
              Impact Report →
            </button>
          </div>

          <div className="recent-card glass">
            <h3>Recent Surplus</h3>
            
            {loading ? (
              <p>Loading recent items...</p>
            ) : recentSurplus.length === 0 ? (
              <p>No recent surplus available.</p>
            ) : (
              recentSurplus.map((item) => (
                <div className="recent-item" key={item._id}>
                  <div>
                    <b>{item.itemName} ({item.quantity}{item.unit})</b>
                    {/* Assuming we populate the restaurant name, otherwise fallback */}
                    <p>{item.restaurantId?.organizationName || "Restaurant"} • {timeAgo(item.createdAt)}</p>
                  </div>
                  <span className={`badge ${item.decision === "sell" ? "sell" : "donate"}`}>
                    {item.decision ? item.decision.charAt(0).toUpperCase() + item.decision.slice(1) : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}