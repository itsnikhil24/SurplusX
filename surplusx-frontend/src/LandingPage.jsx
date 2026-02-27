import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../src/styles/LandingPage.css";
import img1 from "../src/photos/img1.png";
import img2 from "../src/photos/img2.png";
import img3 from "../src/photos/img3.png";
import img4 from "../src/photos/img4.png";
import img5 from "../src/photos/img5.png";
import img6 from "../src/photos/img6.png";

// Import icons from lucide-react
import { Cpu, ShoppingCart, Heart, BarChart3 } from 'lucide-react';

const LandingPage = ({ handleLoginOpen }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotif = {
        id: Date.now(),
        left: 2 + Math.random() * 96,
        top: Math.random() < 0.2 ? 50 + Math.random() * 60 : 65 + Math.random() * 90,
        text: `${Math.floor(Math.random() * 200 + 50)} Meals Saved`,
      };
      setNotifications(prev => [...prev, newNotif].slice(-10));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Cpu size={36} color="#1f7a49" />,
      title: "AI Smart Split",
      desc: "Decides what to sell vs. donate based on freshness, demand & need."
    },
    {
      icon: <ShoppingCart size={36} color="#f58220" />,
      title: "Marketplace",
      desc: "Sell discounted surplus food to conscious consumers — zero waste, maximum value."
    },
    {
      icon: <Heart size={36} color="#edc22b" />,
      title: "NGO Network",
      desc: "Route donations to verified NGOs with real-time capacity tracking."
    },
    {
      icon: <BarChart3 size={36} color="#1f7a49" />,
      title: "Impact Analytics",
      desc: "Track meals saved, CO₂ reduced, and communities served."
    },
  ];

  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">SurplusX</span>
        </div>
        <div className="nav-center">
          <a href="#how">How It Works</a>
          <a href="#features">Features</a>
          <a href="#impact">Impact</a>
        </div>
        <div className="nav-right">
          <button
            className="btn-primary"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">AI-Powered Food Rescue</div>
          <h1 className="hero-title">
            Turn <span className="gradient-text">Food Surplus</span> Into Social Impact
          </h1>
          <p className="hero-subtitle">
            Our AI engine analyzes surplus food in real-time — splitting it between commercial sale and charitable donation for maximum impact, zero waste.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/login")}
            >
              Launch Platform
            </button>
            <button className="btn-secondary">View Demo</button>
          </div>

          {/* Floating Images */}
          <div className="hero-floating-images">
            <img src={img1} alt="img1" className="floating-img float-1" />
            <img src={img2} alt="img2" className="floating-img float-2" />
            <img src={img3} alt="img3" className="floating-img float-3" />
            <img src={img4} alt="img4" className="floating-img float-4" />
            <img src={img5} alt="img5" className="floating-img float-5" />
            <img src={img6} alt="img6" className="floating-img float-6" />
          </div>

          {/* Floating Notifications */}
          {notifications.map((note) => (
            <div
              key={note.id}
              className="floating-notification"
              style={{
                left: `${note.left}%`,
                top: `${note.top}%`,
                opacity: Math.random() * 0.3 + 0.3,
              }}
            >
              {note.text}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <h2 className="section-title">Powered by Intelligence</h2>
          <p className="section-subtitle">Four integrated modules working together</p>
          <div className="features-grid">
            {features.map((f, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-description">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="step-number">1</div>
            <div className="step-title">Sign Up</div>
            <div className="step-desc">Create your account as a restaurant, NGO, or admin.</div>
          </div>
          <div className="feature-card">
            <div className="step-number">2</div>
            <div className="step-title">Post Surplus</div>
            <div className="step-desc">Restaurants post their surplus food.</div>
          </div>
          <div className="feature-card">
            <div className="step-number">3</div>
            <div className="step-title">NGO Picks</div>
            <div className="step-desc">NGOs select and collect the food.</div>
          </div>
          <div className="feature-card">
            <div className="step-number">4</div>
            <div className="step-title">Serve & Impact</div>
            <div className="step-desc">Food reaches those in need efficiently.</div>
          </div>
        </div>
      </section>

   {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 SurplusX — Social Impact Platform developed by Nikhil Sharma and Ambika Kashyap</p>
      </footer>
    </div>
  );
};

export default LandingPage;