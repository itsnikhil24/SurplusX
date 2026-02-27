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
import toast, { Toaster } from 'react-hot-toast'; // <-- Added import
import './styles/LoginPage.css';

const API_URL = "http://localhost:3000/api/auth";

const LoginPage = () => {

  const navigate = useNavigate();

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


  /* ================= GET LOCATION ================= */

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

        () => {

          resolve({
            lat: "",
            lng: ""
          });

        }

      );

    });

  };


  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };


  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      if (isLogin) {

        /* LOGIN */

        const res = await axios.post(`${API_URL}/login`, {

          email: formData.email,
          password: formData.password

        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // <-- Replaced alert with toast
        toast.success(res.data.message || "Logged in successfully!");


        if (res.data.user.role === "restaurant")
          navigate("/dashboard");

        else if (res.data.user.role === "ngo")
          navigate("/ngo-dashboard");

        else
          navigate("/admin-dashboard");

      }

      else {

        /* FETCH LOCATION AUTOMATICALLY */

        const location = await getLocation();


        /* REGISTER */

        const res = await axios.post(`${API_URL}/register`, {

          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          organizationName: formData.organizationName,
          address: formData.address,
          location: location

        });


        // <-- Replaced alert with toast
        toast.success(res.data.message || "Registered successfully!");

        setIsLogin(true);

      }

    }
    catch (err) {
      const errorMessage = err.response?.data?.message || "Server Error";
      setError(errorMessage);
      toast.error(errorMessage); // <-- Also added an error toast here for consistency
    }
    finally {

      setLoading(false);

    }

  };



  return (

    <div className="login-page">

      {/* <-- Added Toaster component to render the toasts on the screen */}
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


              {/* REGISTER FIELDS */}

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
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>Organization Name</label>

                    <input
                      type="text"
                      name="organizationName"
                      placeholder="Enter organization name"
                      value={formData.organizationName}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>Address</label>

                    <input
                      type="text"
                      name="address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={handleChange}
                    />

                  </div>

                </>

              )}



              {/* EMAIL */}

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



              {/* PASSWORD */}

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

                {loading ?
                  "Please Wait..."
                  :
                  isLogin ? "Login" : "Register"
                }

              </button>


            </form>



            <div className="login-footer">

              <p>

                {isLogin ?
                  "Don't have account?"
                  :
                  "Already have account?"
                }

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