import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
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
  Columns
} from "lucide-react";

import "./styles/NgoAllocation.css"; // Ensure this matches your folder structure

const NgoAllocationPage = () => {
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3000/api"; // Ensure port matches your backend

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

      // Fetch NGO Requests
      const ngoRes = await axios.get(API + "/ngo/requests", config);
      // Fetch Surplus Items
      const surplusRes = await axios.get(API + "/surplus/my-items", config);

      const ngoArray = ngoRes.data.data || [];
      const surplusArray = surplusRes.data.data || [];

      // NGO Mapping
      const mappedNGOs = ngoArray.map(req => ({
        id: req._id,
        name: req.ngoName || "NGO",
        locationText: req.location,
        currentLoad: req.currentLoad || 0,
        maxCapacity: req.totalCapacity || 0
      }));

      setNgos(mappedNGOs);

      // Status Mapping based on allocationStatus
      const mappedSurplus = surplusArray.map(item => {
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
    } finally {
      setLoading(false);
    }
  };

  // Smart Allocation Button
  const handleSmartAllocate = async (itemId) => {
    try {
      const config = getAuthHeader();
      await axios.post(
        API + "/allocation/smart-allocate",
        { surplusId: itemId },
        config
      );
      await fetchData();
      alert("Food Allocated Successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Allocation Failed");
    }
  };

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
            <span>FoodShare AI</span>
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
                    transition={{ delay: index * 0.1 }}
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
                donations.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="fs-queue-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                        >
                          Smart Assign
                        </button>
                      )}
                      <span className={`fs-badge fs-badge-${item.status}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default NgoAllocationPage;