import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  LayoutDashboard,
  Upload,
  Store,
  Users,
  BarChart3,
  LogOut,
  Brain,
  ShoppingCart,
  Heart,
} from "lucide-react";

export default function UploadSurplus() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("upload");

  // Upload states
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ item: "", quantity: "", unit: "kg", expiry: "" });
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

  // ===== Inline style objects =====
  const glassCard = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    borderRadius: 20,
    padding: 30,
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    marginTop: 30,
  };

  const cardTitle = { fontSize: "1.75rem", fontWeight: 700, color: "#000000", marginBottom: 12 };
  const cardText = { fontSize: "1rem", color: "rgba(0, 0, 0, 0.8)", lineHeight: 1.6 };
  const aiIcon = { color: "#22C55E" };

  const statCard = {
    background: "rgba(58, 162, 13, 0.66)",
    border: "1px solid rgba(11, 83, 46, 0.8)",
    padding: 40,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  };

  const statNumber = { fontSize: "1.5rem", color: "#000000", marginTop: 10 };
  const statLabel = { fontSize: "0.9rem", color: "rgba(0, 0, 0, 0.7)" };

  const primaryBtn = {
    background: "linear-gradient(135deg, #22C55E, #4ADE80)",
    color: "#000",
    fontWeight: 700,
    padding: "12px 24px",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
  };

  const secondaryBtn = {
    background: "rgba(165, 221, 193, 0.81)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#000000",
    fontWeight: 600,
    padding: "12px 24px",
    borderRadius: 999,
    cursor: "pointer",
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
        </nav>

        <div className="logout" onClick={() => (window.location.href = "/")}>
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>

        {/* Page Title */}
        <div className="welcome">
          <h1>Upload Surplus</h1>
          <p>Submit food surplus and let AI decide the optimal split.</p>
        </div>

        {/* FORM FLOW */}
        <AnimatePresence mode="wait">
          {/* FORM */}
          {step === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              onSubmit={handleSubmit}
              style={glassCard}
            >
              <div style={{ display: "grid", gap: 16 }}>
                <input
                  required
                  placeholder="Item Name"
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                  style={secondaryBtn}
                />
                <div style={{ display: "flex", gap: 16 }}>
                  <input
                    type="number"
                    required
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    style={secondaryBtn}
                  />
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    style={secondaryBtn}
                  >
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                    <option value="litre">litre</option>
                  </select>
                </div>
                <input
                  type="date"
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  style={secondaryBtn}
                />

                <button type="submit" style={primaryBtn}>
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
              style={{ ...glassCard, textAlign: "center" }}
            >
              <Brain size={40} style={aiIcon} />
              <h2 style={cardTitle}>AI Analyzing Surplus...</h2>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={glassCard}>
              <h2 style={cardTitle}>AI Split Decision</h2>
              <p style={cardText}>{result.reasoning}</p>

              <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                <div style={statCard}>
                  <ShoppingCart />
                  <h2 style={statNumber}>{result.sell}%</h2>
                  <span style={statLabel}>Sell</span>
                </div>
                <div style={statCard}>
                  <Heart />
                  <h2 style={statNumber}>{result.donate}%</h2>
                  <span style={statLabel}>Donate</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep("form");
                  setResult(null);
                }}
                style={{ ...secondaryBtn, marginTop: 20 }}
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