import React, { useState, useEffect } from "react";
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
  Columns,
  Clock,
  MapPin,
  ShoppingBag
} from "lucide-react";
import "./styles/Marketplace.css"; // Ensure this matches your file path

export default function Marketplace() {
  const API_BASE = "http://localhost:3000/api/surplus"; // Adjust port if needed
  const token = localStorage.getItem("token") || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  // Fetch Marketplace Items
  const fetchMarketplaceItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/marketplace`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch marketplace items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  // Handle Buy Now
  const handleBuyNow = async (itemId) => {
    if (!token) {
      alert("Please login to purchase items.");
      return;
    }

    try {
      setBuyingId(itemId);
      await axios.post(`${API_BASE}/buy/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Purchase successful!");
      // Refresh the marketplace list so the bought item disappears
      fetchMarketplaceItems();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to purchase item.");
    } finally {
      setBuyingId(null);
    }
  };

  // Helper to calculate hours remaining
  const getHoursRemaining = (expiryDate) => {
    const hours = Math.round((new Date(expiryDate) - new Date()) / (1000 * 60 * 60));
    return hours > 0 ? hours : 0;
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

          <a href="/dashboard" className="fs-nav-item">
            <LayoutDashboard size={18} /> Dashboard
          </a>

          <a href="/uploadsurplus" className="fs-nav-item">
            <Upload size={18} /> Upload Surplus
          </a>

          <a href="/marketplace" className="fs-nav-item active">
            <Store size={18} /> Marketplace
          </a>

          <a href="/ngo-allocation" className="fs-nav-item">
            <Heart size={18} /> NGO Allocation
          </a>

          <a href="/impactdashboard" className="fs-nav-item">
            <BarChart3 size={18} /> Impact Dashboard
          </a>

          <a href="/hunger-map" className="fs-nav-item">
            <Map size={18} /> Hunger Map
          </a>
        </div>

        <div className="fs-sidebar-bottom">
          <a href="/" className="fs-nav-item" onClick={() => localStorage.removeItem("token")}>
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="fs-main">
        {/* Top Header Bar */}
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
              <ShoppingBag size={24} color="#f97316" strokeWidth={2.5} />
              Marketplace
            </h1>
            <p>Browse discounted surplus food from nearby restaurants.</p>
          </div>

          {/* Marketplace Grid */}
          {loading ? (
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Loading available items...</p>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <h3 style={{ color: "#475569", margin: "0 0 8px 0" }}>No items available</h3>
              <p style={{ color: "#94a3b8", margin: 0 }}>Check back later for fresh surplus deals!</p>
            </div>
          ) : (
            <div className="fs-market-grid">
              {items.map((item) => (
                <div key={item._id} className="fs-market-card">
                  
                  {/* Header (Title & Badge) */}
                  <div className="fs-market-card-header">
                    <div>
                      <h3 className="fs-market-title">{item.itemName}</h3>
                      <p className="fs-market-restaurant">
                        {item.restaurantId?.organizationName || item.restaurantId?.name || "Unknown Restaurant"}
                      </p>
                    </div>
                    {/* Defaulting to 'Surplus' badge since Category isn't strictly in the schema */}
                    <span className="fs-market-badge">Surplus</span>
                  </div>

                  {/* Details (Time & Quantity) */}
                  <div className="fs-market-details">
                    <div className="fs-detail-row">
                      <Clock size={16} color="#94a3b8" />
                      <span>Expires in {getHoursRemaining(item.expiryDate)} hours</span>
                    </div>
                    <div className="fs-detail-row">
                      <MapPin size={16} color="#94a3b8" />
                      <span>{item.quantity} {item.unit} available</span>
                    </div>
                  </div>

                  {/* Footer (Price & Button) */}
                  <div className="fs-market-footer">
                    <div className="fs-market-price">
                      {item.pricePerUnit ? `₹${item.pricePerUnit}/${item.unit}` : "Free"}
                    </div>
                    <button 
                      className="fs-btn-buy" 
                      onClick={() => handleBuyNow(item._id)}
                      disabled={buyingId === item._id}
                      style={{ opacity: buyingId === item._id ? 0.7 : 1, cursor: buyingId === item._id ? "not-allowed" : "pointer" }}
                    >
                      {buyingId === item._id ? "Processing..." : "Buy Now"}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}