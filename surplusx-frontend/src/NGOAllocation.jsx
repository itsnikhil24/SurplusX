import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Heart,
  MapPin,
  Package,
  CheckCircle,
  Users,
  LayoutDashboard,
  Upload,
  Store,
  BarChart3,
  Map,
  LogOut,
  Leaf,
  Columns,
  Loader
} from "lucide-react";

import "./styles/NgoAllocation.css";

const NgoAllocationPage = () => {
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allocatingId, setAllocatingId] = useState(null);

  const API = "http://localhost:3000/api";

  // Authorization Header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = getAuthHeader();

      const ngoRes = await axios.get(API + "/ngo/requests", config);
      const surplusRes = await axios.get(API + "/surplus/my-items", config);

      const ngoArray = ngoRes.data.data || [];
      const surplusArray = surplusRes.data.data || [];

      const mappedNGOs = ngoArray.map((req) => ({
        id: req._id,
        name: req.ngoName || "NGO",
        locationText: req.location,
        currentLoad: req.currentLoad || 0,
        maxCapacity: req.totalCapacity || 0
      }));

      setNgos(mappedNGOs);

      const mappedSurplus = surplusArray.map((item) => {
        let status = "pending";
        if (item.allocationStatus === "assigned") status = "assigned";
        else if (item.allocationStatus === "delivered") status = "delivered";
        else if (item.allocationStatus === "unassigned") status = "pending";

        return {
          _id: item._id,
          foodName: item.itemName,
          quantity: item.quantity + " " + item.unit,
          expiry: new Date(item.expiryDate).toLocaleDateString(),
          status
        };
      });

      setDonations(mappedSurplus);
    } catch (error) {
      console.log("API ERROR:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Smart Allocation Button — now enforces a visible wait (2.5s) and shows toast + spinner
  const handleSmartAllocate = async (itemId) => {
    setAllocatingId(itemId);

    // Use this toast id to update the same toast later
    let toastId = null;

    try {
      const config = getAuthHeader();

      // show loading toast
      toastId = toast.loading("Smart allocation in progress...");

      // start API call and a delay in parallel — ensures UI shows allocating for at least 2.5s
      const apiPromise = axios.post(API + "/allocation/smart-allocate", { surplusId: itemId }, config);
      const delayPromise = new Promise((res) => setTimeout(res, 2500)); // 2.5s visible wait

      // wait for both to finish (if API is faster, we still wait 2.5s; if API is slower, we wait for API)
      const [apiRes] = await Promise.all([apiPromise, delayPromise]);

      // refresh data after allocation
      await fetchData();

      // replace loading toast with success
      toast.success("Food Allocated Successfully!", { id: toastId });
    } catch (error) {
      // replace loading toast with error
      const msg = error?.response?.data?.message || "Allocation Failed";
      if (toastId) toast.error(msg, { id: toastId });
      else toast.error(msg);
    } finally {
      // reset allocation state so skeleton/button/other UI returns to normal
      setAllocatingId(null);
    }
  };

  return (
    <div className="fs-layout">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

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
          <a href="/uploadsurplus" className="fs-nav-item"><Upload size={18} /> Upload Surplus</a>
          <a href="/marketplace" className="fs-nav-item"><Store size={18} /> Marketplace</a>
          <a href="/ngo-allocation" className="fs-nav-item active"><Heart size={18} /> NGO Allocation</a>
          <a href="/impactdashboard" className="fs-nav-item"><BarChart3 size={18} /> Impact Dashboard</a>
          <a href="/hunger-map" className="fs-nav-item"><Map size={18} /> Hunger Map</a>
        </div>

        <div className="fs-sidebar-bottom">
          <a href="/" className="fs-nav-item" onClick={() => localStorage.removeItem("token")}>
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="fs-main">
        {/* Topbar */}
        <header className="fs-topbar">
          <div className="fs-breadcrumb">
            <Columns size={16} color="#64748b" />
            <span>SurplusX</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="fs-content">
          <div className="fs-page-header">
            <h1>
              <Heart size={24} color="#e53e3e" strokeWidth={2.5} />
              NGO Allocation
            </h1>
            <p>Manage donated food and track active NGO assignments.</p>
          </div>

          {/* NGO Requests Grid */}
          <section className="fs-section">
            <h2 className="fs-section-title">Active NGO Requests</h2>

            <div className="fs-ngo-grid">
              {loading ? (
                <p className="fs-loading-text">Loading NGOs...</p>
              ) : ngos.length === 0 ? (
                <div className="fs-empty-state">No NGO Requests Found</div>
              ) : (
                ngos.map((ngo, index) => (
                  <motion.div
                    key={ngo.id}
                    className="fs-ngo-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="fs-ngo-card-header">
                      <div className="fs-ngo-icon-bg">
                        <Users size={20} color="#2f855a" />
                      </div>
                      <div>
                        <h3 className="fs-ngo-name">{ngo.name}</h3>
                        <div className="fs-ngo-location">
                          <MapPin size={14} />
                          {ngo.locationText}
                        </div>
                      </div>
                    </div>

                    <div className="fs-capacity-section">
                      <div className="fs-capacity-labels">
                        <span>Current Load</span>
                        <span>{ngo.currentLoad} / {ngo.maxCapacity} kg</span>
                      </div>
                      <div className="fs-progress-bar-bg">
                        <div
                          className="fs-progress-bar-fill"
                          style={{
                            width: `${Math.min(100, Math.max(0, (Number(ngo.currentLoad) || 0) / (Number(ngo.maxCapacity) || 1) * 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Donation Queue List */}
          <section className="fs-section" style={{ marginTop: "40px" }}>
            <h2 className="fs-section-title">Donation Queue</h2>

            <div className="fs-queue-list">
              {loading ? (
                <p className="fs-loading-text">Loading Items...</p>
              ) : donations.length === 0 ? (
                <div className="fs-empty-state">No Surplus Items in Queue</div>
              ) : (
                donations.map((item, index) => {
                  // SKELETON STATE: Render this if the current item is being allocated
                  if (allocatingId === item._id) {
                    return (
                      <motion.div
                        key={`skeleton-${item._id}`}
                        className="fs-queue-item"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        style={{ display: "flex", alignItems: "center", gap: "15px", backgroundColor: "#f8fafc" }}
                      >
                        {/* Fake Icon Placeholder */}
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "#cbd5e1" }} />

                        {/* Fake Text Placeholder */}
                        <div style={{ flex: 1 }}>
                          <div style={{ height: "18px", width: "30%", backgroundColor: "#cbd5e1", borderRadius: "4px", marginBottom: "8px" }} />
                          <div style={{ height: "14px", width: "20%", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
                        </div>

                        {/* Loading Text and Spinner */}
                        <div style={{ color: "#3b82f6", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <Loader size={16} />
                          </motion.div>
                          Smartly allocating to NGO...
                        </div>
                      </motion.div>
                    );
                  }

                  // NORMAL STATE
                  return (
                    <motion.div
                      key={item._id}
                      className="fs-queue-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className={`fs-queue-icon-box ${item.status === "delivered" ? "delivered" : "pending"}`}>
                        {item.status === "delivered" ? <CheckCircle size={20} /> : <Package size={20} />}
                      </div>

                      <div className="fs-queue-details">
                        <h3>{item.foodName} <span className="fs-queue-qty">({item.quantity})</span></h3>
                        <p className="fs-queue-meta">Expiry: {item.expiry}</p>
                      </div>

                      <div className="fs-queue-action">
                        {item.status === "pending" && (
                          <button
                            className="fs-btn-assign"
                            onClick={() => handleSmartAllocate(item._id)}
                            disabled={allocatingId === item._id}
                            style={{
                              opacity: allocatingId === item._id ? 0.7 : 1,
                              cursor: allocatingId === item._id ? "not-allowed" : "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px"
                            }}
                          >
                            {allocatingId === item._id ? (
                              <>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                  <Loader size={16} />
                                </motion.div>
                                Smart Allocating...
                              </>
                            ) : (
                              "Smart Assign"
                            )}
                          </button>
                        )}
                        <span className={`fs-badge fs-badge-${item.status}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default NgoAllocationPage;