import React, { useState } from "react";
import "../src/styles/Dashboard.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  LayoutDashboard,
  Upload,
  Store,
  Users,
  BarChart3,
  Map,
  LogOut,
  Brain,
  ShoppingCart,
  Heart,
} from "lucide-react";

export default function UploadSurplus() {
  // 🔥 sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("upload");

  // 🔥 upload states
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    item: "",
    quantity: "",
    unit: "kg",
    expiry: "",
  });
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep("analyzing");

    setTimeout(() => {
      const sell = Math.floor(Math.random() * 40) + 30;
      setResult({
        sell,
        donate: 100 - sell,
        reasoning: `Based on submitted surplus data, ${sell}% is optimal for marketplace sale. Remaining ${100 - sell}% routed to highest-need NGO.`,
      });
      setStep("result");
    }, 2500);
  };

  return (
    <div className="dashboard">
      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">🍽️ {sidebarOpen && "SurplusX"}</div>
        </div>

        <nav className="sidebar-menu">
          <a
            className={activeMenu === "dashboard" ? "active" : ""}
            onClick={() => (window.location.href = "/dashboard")}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </a>

          <a
            className={activeMenu === "upload" ? "active" : ""}
            onClick={() => setActiveMenu("upload")}
          >
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
        {/* Topbar */}
        <div className="topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* ===== Page Title ===== */}
        <div className="welcome">
          <h1>Upload Surplus</h1>
          <p>Submit food surplus and let AI decide the optimal split.</p>
        </div>

        {/* ===== FORM FLOW ===== */}
        <AnimatePresence mode="wait">
          {/* FORM */}
          {step === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              onSubmit={handleSubmit}
              className="quick-card glass"
              style={{ maxWidth: 900, marginTop: 20 }}
            >
              <div style={{ display: "grid", gap: 16 }}>
                {/* Item Name */}
                <input
                  required
                  placeholder="Item Name"
                  value={form.item}
                  onChange={(e) =>
                    setForm({ ...form, item: e.target.value })
                  }
                  className="secondary-btn"
                />

                {/* Quantity + Unit */}
                <div className="stats-grid">
                  <input
                    type="number"
                    required
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                    className="secondary-btn"
                  />

                  <select
                    value={form.unit}
                    onChange={(e) =>
                      setForm({ ...form, unit: e.target.value })
                    }
                    className="secondary-btn"
                  >
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                    <option value="litre">litre</option>
                  </select>
                </div>

                {/* Expiry */}
                <input
                  type="date"
                  value={form.expiry}
                  onChange={(e) =>
                    setForm({ ...form, expiry: e.target.value })
                  }
                  className="secondary-btn"
                />

                <button type="submit" className="primary-btn">
                  <Brain size={18} /> Analyze with AI
                </button>
              </div>
            </motion.form>
          )}

          {/* ANALYZING */}
          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="quick-card glass"
              style={{ textAlign: "center", marginTop: 20 }}
            >
              <Brain size={40} />
              <h2 style={{ marginTop: 10 }}>AI Analyzing Surplus...</h2>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="quick-card glass"
              style={{ marginTop: 20 }}
            >
              <h2>AI Split Decision</h2>
              <p style={{ marginTop: 10 }}>{result.reasoning}</p>

              <div className="stats-grid" style={{ marginTop: 20 }}>
                <div className="stat-card glass">
                  <ShoppingCart />
                  <h2>{result.sell}%</h2>
                  <span>Sell</span>
                </div>

                <div className="stat-card glass">
                  <Heart />
                  <h2>{result.donate}%</h2>
                  <span>Donate</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep("form");
                  setResult(null);
                }}
                className="secondary-btn"
                style={{ marginTop: 20 }}
              >
                Upload Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}