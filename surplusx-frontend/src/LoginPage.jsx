import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './styles/LoginPage.css';
import { useAuth } from "./context/AuthContext"

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE}/auth`;

const LoginPage = () => {

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "restaurant",
    phone: "",
    organizationName: "",
    address: "",
    location: {
      lat: "",
      lng: ""
    }
  });

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: "", lng: "" });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
          });
        },
        () => resolve({ lat: "", lng: "" })
      );
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      if (isLogin) {

        const res = await axios.post(`${API_URL}/login`, {
          email: formData.email,
          password: formData.password
        });

        // ✅ FIX: use context login (not localStorage directly)
        await login(res.data.token);

        toast.success(res.data.message || "Logged in successfully!");

        // ✅ redirect AFTER auth sync
        navigate("/dashboard");

      } else {

        const location = await getLocation();

        const res = await axios.post(`${API_URL}/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          organizationName: formData.organizationName,
          address: formData.address,
          location
        });

        toast.success(res.data.message || "Registered successfully!");
        setIsLogin(true);
      }

    } catch (err) {

      const errorMessage = err.response?.data?.message || "Server Error";
      setError(errorMessage);
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <Toaster position="top-center" reverseOrder={false} />

      <motion.button
        className="back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={20} /> Back
      </motion.button>

      <div className="login-container">

        {/* LEFT */}
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-logo">
              <Sparkles size={40} />
            </div>

            <h1 className="brand-title">
              Surplus<span className="brand-accent">X</span>
            </h1>

            <p className="brand-tagline">
              Optimising Profit Minimising Hunger
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">

            <h2 className="login-title">
              {isLogin ? "Login" : "Register"}
            </h2>

            {error && (
              <p className="error-msg">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="login-form">

              {!isLogin && (
                <>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="ngo">NGO</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Organization Name</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                className="submit-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Please Wait..." : isLogin ? "Login" : "Register"}
              </button>

            </form>

            <div className="login-footer">
              <p>
                {isLogin ? "Don't have account?" : "Already have account?"}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;