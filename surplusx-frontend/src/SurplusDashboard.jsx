import React, { useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Upload,
  Store,
  Heart,
  BarChart3,
  Map,
  LogOut,
  Leaf,
  Sparkles,
  Columns,
  Brain,
  CheckCircle,
  XCircle
} from "lucide-react";
import "./styles/SurplusDashboard.css";

export default function UploadSurplus() {
  const API_BASE = "http://localhost:3000/api/surplus"; // Adjust port if needed
  const token = localStorage.getItem("token") || "";

  // UI States
  const [step, setStep] = useState("form"); // "form" | "analyzing"
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    itemName: "",
    category: "Select",
    quantity: "",
    unit: "kg",
    expiryDate: "", // Changed to handle specific date and time
    pricePerUnit: "",
    restaurantLocation: "",
    latitude: "",
    longitude: ""
  });

  // Helper to trigger floating toast messages
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Auto-hide after 5 seconds
  };

  // Fill coordinates using browser geolocation
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString()
        }));
        showToast("Location grabbed successfully!", "success");
      },
      (err) => {
        showToast("Unable to fetch location: " + err.message, "error");
      },
      { timeout: 10000 }
    );
  };

  const validate = () => {
    if (!form.itemName.trim()) {
      showToast("Please enter the food item name.", "error");
      return false;
    }
    if (!form.quantity || Number(form.quantity) <= 0) {
      showToast("Please provide a valid quantity.", "error");
      return false;
    }
    if (!form.expiryDate) {
      showToast("Please select an expiry date and time.", "error");
      return false;
    }
    if (!form.pricePerUnit || Number(form.pricePerUnit) <= 0) {
      showToast("Please provide price per unit.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    if (!token) {
      showToast("No auth token found. Please login.", "error");
      return;
    }

    // Switch UI to analyzing state
    setStep("analyzing");

    try {
      const payload = {
        itemName: form.itemName,
        quantity: Number(form.quantity),
        unit: form.unit || "kg",
        expiryDate: new Date(form.expiryDate).toISOString(), // Convert selected date to ISO
        pricePerUnit: Number(form.pricePerUnit),
        restaurantLocation: form.restaurantLocation || "",
        coordinates: {
          latitude: form.latitude ? Number(form.latitude) : undefined,
          longitude: form.longitude ? Number(form.longitude) : undefined
        }
      };

      if (!payload.coordinates.latitude || !payload.coordinates.longitude) {
        payload.coordinates = undefined;
      }

      const res = await axios.post(`${API_BASE}/upload`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Artificial delay to let the user see the cool "Analyzing" animation
      setTimeout(() => {
        const decision = res.data?.decision || "pending";
        
        // Trigger Toast with AI Decision
        showToast(`AI Smart Split Complete! Item marked to ${decision.toUpperCase()}.`, "success");
        
        // Reset Form & UI
        setForm({
          itemName: "",
          category: "Select",
          quantity: "",
          unit: "kg",
          expiryDate: "",
          pricePerUnit: "",
          restaurantLocation: "",
          latitude: "",
          longitude: ""
        });
        setStep("form");
      }, 2000); 

    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Upload failed. Please try again.";
      showToast(msg, "error");
      setStep("form"); // Kick back to form if it fails
    }
  };

  return (
    <div className="fs-layout">
      
      {/* ===== Floating Toast Notification ===== */}
      {toast && (
        <div className="fs-toast-container">
          <div className={`fs-toast ${toast.type}`}>
            {toast.type === "success" ? (
              <CheckCircle size={20} color="#2f855a" />
            ) : (
              <XCircle size={20} color="#e53e3e" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

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
          <a href="/dashboard" className="fs-nav-item"><LayoutDashboard size={18} /> Dashboard</a>
          <a href="/uploadsurplus" className="fs-nav-item active"><Upload size={18} /> Upload Surplus</a>
          <a href="/marketplace" className="fs-nav-item"><Store size={18} /> Marketplace</a>
          <a href="/ngo-allocation" className="fs-nav-item"><Heart size={18} /> NGO Allocation</a>
          <a href="/impactdashboard" className="fs-nav-item"><BarChart3 size={18} /> Impact Dashboard</a>
          <a href="/hunger-map" className="fs-nav-item"><Map size={18} /> Hunger Map</a>
        </div>

        <div className="fs-sidebar-bottom">
          <a href="/" className="fs-nav-item">
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="fs-main">
        <header className="fs-topbar">
          <div className="fs-breadcrumb">
            <Columns size={16} color="#64748b" />
            <span>SurplusX</span>
          </div>
        </header>

        <div className="fs-content">
          <div className="fs-page-header">
            <h1>
              <Upload size={24} color="#2f855a" strokeWidth={2.5} />
              Upload Surplus
            </h1>
            <p>Add your surplus food and let AI decide the best split.</p>
          </div>

          <div className="fs-form-card">
            
            {/* Conditional Rendering: Form vs Analyzing */}
            {step === "form" ? (
              <form onSubmit={handleSubmit}>
                <div className="fs-form-group">
                  <label>Food Item Name</label>
                  <input
                    type="text"
                    className="fs-input"
                    placeholder="e.g., Cooked Rice, Paneer Tikka"
                    value={form.itemName}
                    onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                  />
                </div>

                <div className="fs-form-row">
                  <div className="fs-form-group">
                    <label>Category</label>
                    <select
                      className="fs-input fs-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="Select">Select</option>
                      <option value="Cooked">Cooked Food</option>
                      <option value="Raw">Raw Ingredients</option>
                      <option value="Packaged">Packaged Goods</option>
                    </select>
                  </div>

                  <div className="fs-form-group">
                    <label>Quantity</label>
                    <div className="fs-quantity-wrapper">
                      <input
                        type="number"
                        className="fs-input"
                        placeholder="25"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      />
                      <select
                        className="fs-input fs-unit-select"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      >
                        <option value="kg">kg</option>
                        <option value="pcs">pcs</option>
                        <option value="L">L</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="fs-form-group">
                  <label>Expiry Date & Time</label>
                  <input
                    type="datetime-local"
                    className="fs-input"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>

                <div className="fs-form-row">
                  <div className="fs-form-group">
                    <label>Price per unit (₹)</label>
                    <input
                      type="number"
                      className="fs-input"
                      placeholder="e.g., 20"
                      value={form.pricePerUnit}
                      onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                    />
                  </div>

                  <div className="fs-form-group">
                    <label>Restaurant Location (optional)</label>
                    <input
                      type="text"
                      className="fs-input"
                      placeholder="City / Landmark"
                      value={form.restaurantLocation}
                      onChange={(e) => setForm({ ...form, restaurantLocation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fs-form-row">
                  <div className="fs-form-group">
                    <label>Latitude (optional)</label>
                    <input
                      type="text"
                      className="fs-input"
                      placeholder="e.g., 28.6139"
                      value={form.latitude}
                      onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    />
                  </div>

                  <div className="fs-form-group">
                    <label>Longitude (optional)</label>
                    <input
                      type="text"
                      className="fs-input"
                      placeholder="e.g., 77.2090"
                      value={form.longitude}
                      onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24 }}>
                  <button
                    type="button"
                    style={{ background: "#e2e8f0", color: "#1e293b", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500" }}
                    onClick={useCurrentLocation}
                  >
                    Use current location
                  </button>
                  <small style={{ color: "#94a3b8", fontSize: "0.8rem" }}>or enter latitude & longitude manually</small>
                </div>

                <button type="submit" className="fs-btn-submit">
                  <Sparkles size={18} /> Run AI Smart Split
                </button>
              </form>
            ) : (
              /* Analyzing State UI */
              <div className="fs-analyzing-state">
                <Brain size={64} color="#2f855a" className="fs-pulse" />
                <h3>AI is Analyzing Surplus...</h3>
                <p>Evaluating shelf life, market demand, and NGO needs to determine the optimal split between Donation and Selling.</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}