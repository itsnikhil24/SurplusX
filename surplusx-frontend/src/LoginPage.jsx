import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import '../src/styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'restaurant',
    phone: '',
    organizationName: '',
    address: '',
    location: { lat: '', lng: '' }
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "lat" || name === "lng"){
      setFormData(prev => ({ ...prev, location: { ...prev.location, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if(isLogin){
        // LOGIN → only email & password
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        alert(res.data.msg);
        navigate('/dashboard');
      } else {
        // REGISTER → full schema
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          organizationName: formData.organizationName,
          address: formData.address,
          location: formData.location
        });
        alert(res.data.msg);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="login-page">
      {/* Back Button */}
      <motion.button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20}/> <span>Back to Home</span>
      </motion.button>

      <div className="login-container">
        {/* Branding */}
        <motion.div className="login-left">
          <div className="login-brand">
            <motion.div className="brand-logo"><Sparkles size={48}/></motion.div>
            <h1 className="brand-title">Surplus<span className="brand-accent">X</span></h1>
            <p className="brand-tagline">Optimising Profit, Minimising Hunger</p>
          </div>
        </motion.div>

        {/* Login / Register Form */}
        <motion.div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="login-subtitle">{isLogin ? 'Sign in to continue making impact' : 'Join us in reducing food waste'}</p>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Name, Role, Phone, Organization, Address, Location → only on Register */}
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-wrapper">
                      <input type="text" id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="input-wrapper">
                      <option value="restaurant">Restaurant</option>
                      <option value="ngo">NGO</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <div className="input-wrapper">
                      <input type="text" id="phone" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="organizationName">Organization Name</label>
                    <div className="input-wrapper">
                      <input type="text" id="organizationName" name="organizationName" placeholder="Organization Name" value={formData.organizationName} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <div className="input-wrapper">
                      <input type="text" id="address" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <div className="input-wrapper">
                      <input type="text" name="lat" placeholder="Latitude" value={formData.location.lat} onChange={handleChange} />
                      <input type="text" name="lng" placeholder="Longitude" value={formData.location.lng} onChange={handleChange} />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18}/>
                  <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required/>
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18}/>
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required/>
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              <motion.button type="submit" className="submit-btn">
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ChevronRight size={20}/>
              </motion.button>
            </form>

            {/* Footer → toggle login/register */}
            <div className="login-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign Up' : 'Sign In'}</button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;