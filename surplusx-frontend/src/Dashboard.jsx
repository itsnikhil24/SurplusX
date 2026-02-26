import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Dashboard.css"; // Ensure you include the fs- CSS classes here
import {
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
  Leaf,
  Map,
  Columns
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
    <div className="fs-layout">

      {/* ===== Sidebar ===== */}
      <aside className="fs-sidebar">
        <div className="fs-brand">
          <div className="fs-logo-icon">
            <Leaf size={20} color="#68d391" />
          </div>
          <div className="fs-brand-text">
            <h2>FoodShare AI</h2>
            <p>Restaurant Portal</p>
          </div>
        </div>

        <div className="fs-nav-group">
          <div className="fs-nav-label">NAVIGATION</div>

          <Link to="/dashboard" className="fs-nav-item active">
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link to="/uploadsurplus" className="fs-nav-item">
            <Upload size={18} /> Upload Surplus
          </Link>

          <Link to="/marketplace" className="fs-nav-item">
            <Store size={18} /> Marketplace
          </Link>

          <Link to="/ngo-allocation" className="fs-nav-item">
            <Heart size={18} /> NGO Allocation
          </Link>

          <Link to="/impactdashboard" className="fs-nav-item">
            <BarChart3 size={18} /> Impact Dashboard
          </Link>

          <Link to="/hunger-map" className="fs-nav-item">
            <Map size={18} /> Hunger Map
          </Link>
        </div>

        <div className="fs-sidebar-bottom">
          <div 
            className="fs-nav-item" 
            style={{ cursor: "pointer" }} 
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <LogOut size={18} /> Logout
          </div>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="fs-main">
        {/* Topbar */}
        <header className="fs-topbar">
          <div className="fs-breadcrumb">
            <Columns size={16} color="#64748b" />
            <span>FoodShare AI</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="fs-content">
          <div className="welcome">
            <h1 className="typewriter">{typedText}</h1>
            <p style={{ color: "var(--fs-text-muted)", marginBottom: "32px", fontWeight: "500" }}>
              Optimizing Profit, Minimizing Hunger
            </p>
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
        </div>
      </main>
    </div>
  );
}