import React, { useEffect, useState } from "react";
import "../src/styles/Dashboard.css";
import { motion } from "framer-motion";
import {
  Menu,
  ShoppingBag,
  Clock,
  MapPin,
  LayoutDashboard,
  Upload,
  Store,
  Users,
  BarChart3,
  Map,
  LogOut,
} from "lucide-react";

export default function Marketplace() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState([]);

  // ✅ NEW — toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  // 🔥 EASY BACKEND INTEGRATION
  useEffect(() => {
    setItems([
      {
        id: 1,
        name: "Veg Biryani",
        restaurant: "Spice Garden",
        expiresIn: "2 hrs",
        quantity: "12 plates",
        price: "₹120",
      },
      {
        id: 2,
        name: "Paneer Tikka",
        restaurant: "Tandoor House",
        expiresIn: "1 hr",
        quantity: "8 plates",
        price: "₹150",
      },
      {
        id: 3,
        name: "Mixed Veg",
        restaurant: "Green Bowl",
        expiresIn: "3 hrs",
        quantity: "15 plates",
        price: "₹90",
      },
    ]);
  }, []);

  // ✅ UPDATED — toast instead of alert
  const handleBuy = (item) => {
    setToast({
      show: true,
      message: `Order for ${item.name} placed successfully`,
    });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  return (
    <div className="dashboard">
      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">🍽️ {sidebarOpen && "SurplusX"}</div>
        </div>

        <nav className="sidebar-menu">
          <a onClick={() => (window.location.href = "/dashboard")}>
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </a>

          <a onClick={() => (window.location.href = "/upload")}>
            <Upload size={20} />
            {sidebarOpen && <span>Upload Surplus</span>}
          </a>

          <a onClick={() => navigate("/marketplace")}>
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

      
        </nav>

     
           <div className="logout" onClick={() => (window.location.href = "/")}>
       <LogOut size={20} />
       {sidebarOpen && <span>Logout</span>}
     </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="main">
        {/* ✅ Toast */}
        {toast.show && (
          <div className="toast">
            ✅ {toast.message}
          </div>
        )}

        {/* Topbar */}
        <div className="topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Header */}
        <div
          className="welcome"
          style={{ maxWidth: 1200, margin: "0 auto 24px auto" }}
        >
          <h1
            style={{
              color: "#0c3b2e",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ShoppingBag size={28} />
            Marketplace
          </h1>

          <p style={{ color: "#3a6b5a" }}>
            Browse discounted surplus food from nearby restaurants.
          </p>
        </div>

        {/* ===== GRID ===== */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="stat-card glass"
            >
              <div style={{ marginBottom: 10 }}>
                <h3 style={{ color: "#0c3b2e", fontWeight: 600 }}>
                  {item.name}
                </h3>
                <p style={{ color: "#4f7d6b", fontSize: 13 }}>
                  {item.restaurant}
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    color: "#4f7d6b",
                    fontSize: 13,
                  }}
                >
                  <Clock size={14} /> Expires in {item.expiresIn}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    color: "#4f7d6b",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  <MapPin size={14} /> {item.quantity} available
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#0c3b2e",
                  }}
                >
                  {item.price}
                </span>

                <button
                  className="primary-btn"
                  onClick={() => handleBuy(item)}
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}