import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    LogOut,
    Leaf
} from "lucide-react";

import axios from "axios";
import "./styles/NgoAllocation.css";

const NgoAllocationPage = () => {

    const [ngos, setNgos] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

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

            // Fetch NGO Requests
            const ngoRes = await axios.get(
                API + "/ngo/requests",
                config
            );

            // Fetch Surplus Items
            const surplusRes = await axios.get(
                API + "/surplus/my-items",
                config
            );


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



            // ✅ STATUS BASED ON allocationStatus
            const mappedSurplus = surplusArray.map(item => {

                let status = "pending";

                if (item.allocationStatus === "assigned") {
                    status = "assigned";
                }
                else if (item.allocationStatus === "delivered") {
                    status = "delivered";
                }
                else if (item.allocationStatus === "unassigned") {
                    status = "pending";
                }

                return {

                    _id: item._id,

                    foodName: item.itemName,

                    quantity: item.quantity + " " + item.unit,

                    expiry: new Date(item.expiryDate)
                        .toLocaleDateString(),

                    status

                };

            });


            setDonations(mappedSurplus);

        }
        catch (error) {

            console.log("API ERROR:", error);

        }
        finally {

            setLoading(false);

        }

    };



    // Smart Allocation Button
    const handleSmartAllocate = async (itemId) => {

        try {

            const config = getAuthHeader();

            await axios.post(

                API + "/allocation/smart-allocate",

                {
                    surplusId: itemId
                },

                config

            );

            await fetchData();

            alert("Food Allocated Successfully");

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Allocation Failed"
            );

        }

    };



    return (

        <div className="allocation-page">


            {/* SIDEBAR */}

            <div className="sidebar">

                <div className="sidebar-logo">

                    <div className="sidebar-logo-title">

                        <Leaf size={24} color="#10B981" />

                        <span>FoodShare AI</span>

                    </div>

                    <span className="sidebar-logo-subtitle">
                        Restaurant Portal
                    </span>

                </div>


                <div className="nav-section-title">
                    NAVIGATION
                </div>


                <div className="nav-menu">

                    <div className="nav-item">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </div>

                    <div className="nav-item">
                        <Upload size={18} />
                        Upload Surplus
                    </div>

                    <div className="nav-item">
                        <Store size={18} />
                        Marketplace
                    </div>

                    <div className="nav-item active">
                        <Heart size={18} />
                        NGO Allocation
                    </div>

                    <div className="nav-item">
                        <BarChart3 size={18} />
                        Impact Dashboard
                    </div>

                    <div className="nav-item">
                        <MapPin size={18} />
                        Hunger Map
                    </div>

                </div>


                <div className="logout-btn">
                    <LogOut size={18} />
                    Logout
                </div>

            </div>



            {/* MAIN CONTENT */}

            <div className="main-content">


                <header className="page-header">

                    <div className="header-title">

                        <Heart size={28} />

                        <h1>NGO Allocation</h1>

                    </div>

                    <p className="header-subtitle">

                        Manage donated food and NGO assignments

                    </p>

                </header>



                {/* NGO REQUESTS */}

                <section className="ngo-grid">

                    {loading ? (

                        <p>Loading NGOs...</p>

                    ) : ngos.length === 0 ? (

                        <p>No NGO Requests Found</p>

                    ) : (

                        ngos.map((ngo, index) => (

                            <motion.div
                                key={ngo.id}
                                className="ngo-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >

                                <div className="ngo-card-header">

                                    <div className="ngo-icon-bg">
                                        <Users size={20} />
                                    </div>

                                    <div>

                                        <h3 className="ngo-name">
                                            {ngo.name}
                                        </h3>

                                        <div className="ngo-location">

                                            <MapPin size={14} />
                                            {ngo.locationText}

                                        </div>

                                    </div>

                                </div>


                                <div className="capacity-section">

                                    <div className="capacity-labels">

                                        <span>Required</span>

                                        <span>
                                            {ngo.currentLoad}/{ngo.maxCapacity}
                                        </span>

                                    </div>


                                    <div className="progress-bar-bg">

                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        (Number(ngo.currentLoad) || 0) /
                                                        (Number(ngo.maxCapacity) || 1) * 100
                                                    )
                                                )}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            </motion.div>

                        ))

                    )}

                </section>



                {/* DONATION QUEUE */}

                <section className="queue-section">

                    <h2 className="section-title">
                        Donation Queue
                    </h2>


                    <div className="queue-list">

                        {loading ? (

                            <p>Loading Items...</p>

                        ) : donations.length === 0 ? (

                            <p>No Surplus Items Found</p>

                        ) : (

                            donations.map((item, index) => (

                                <motion.div
                                    key={item._id}
                                    className="queue-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >

                                    <div className="item-icon-box gray">

                                        {item.status === "delivered"
                                            ?
                                            <CheckCircle size={20} />
                                            :
                                            <Package size={20} />
                                        }

                                    </div>


                                    <div className="item-details">

                                        <h3>
                                            {item.foodName}
                                            {" - "}
                                            {item.quantity}
                                        </h3>

                                        <p className="item-meta">

                                            Expiry:
                                            {" "}
                                            {item.expiry}

                                        </p>

                                    </div>


                                    <div className="item-action">

                                        {item.status === "pending" && (

                                            <button
                                                className="assign-btn"
                                                onClick={() => handleSmartAllocate(item._id)}
                                            >
                                                Assign
                                            </button>

                                        )}

                                        <span className="badge badge-yellow">
                                            {item.status}
                                        </span>

                                    </div>

                                </motion.div>

                            ))

                        )}

                    </div>

                </section>



            </div>

        </div>

    );

};

export default NgoAllocationPage;