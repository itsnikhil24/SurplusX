import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Upload,
    Store,
    Heart,
    BarChart3,
    Map as MapIcon,
    LogOut,
    Leaf,
    Columns,
    Users,
    TrendingDown,
    AlertTriangle
} from "lucide-react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    CircleMarker
} from "react-leaflet";

import axios from "axios";
import L from "leaflet";

import "./styles/HungerMap.css";

export default function HungerMap() {

    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);


    /*
    FETCH NGO REQUESTS
    */

    useEffect(() => {

        fetchNgoRequests();

    }, [])


    const fetchNgoRequests = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:3000/api/ngo/requests",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNgos(res.data.data);
            setLoading(false);

        }
        catch (error) {

            console.log(error);
            setLoading(false);

        }

    }


    /*
    CALCULATE SEVERITY
    */

    const getSeverity = (ngo) => {

        const percent =
            (ngo.currentLoad / ngo.totalCapacity) * 100;

        if (percent > 70) return "High";

        if (percent > 40) return "Medium";

        return "Low";

    }



    const getColorClass = (severity) => {

        if (severity === "High") return "danger";

        if (severity === "Medium") return "warning";

        return "success";

    }



    /*
    MAP CENTER INDIA
    */

    const center = [22.59, 78.96]



    return (

        <div className="fs-layout">


            {/* SIDEBAR */}

            <aside className="fs-sidebar">

                <div className="fs-brand">

                    <div className="fs-logo-icon">

                        <Leaf size={20} />

                    </div>

                    <div className="fs-brand-text">

                        <h2>SurplusX</h2>

                        <p>Restaurant Portal</p>

                    </div>

                </div>



                <div className="fs-nav-group">

                    <div className="fs-nav-label">
                        NAVIGATION
                    </div>


                    <a href="/dashboard" className="fs-nav-item">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </a>


                    <a href="/uploadsurplus" className="fs-nav-item">
                        <Upload size={18} />
                        Upload Surplus
                    </a>


                    <a href="/marketplace" className="fs-nav-item">
                        <Store size={18} />
                        Marketplace
                    </a>


                    <a href="/ngo-allocation" className="fs-nav-item">
                        <Heart size={18} />
                        NGO Allocation
                    </a>


                    <a href="/impactdashboard" className="fs-nav-item">
                        <BarChart3 size={18} />
                        Impact Dashboard
                    </a>


                    <a href="/hunger-map" className="fs-nav-item active">
                        <MapIcon size={18} />
                        Hunger Map
                    </a>

                </div>


                <div className="fs-sidebar-bottom">

                    <a
                        href="/"
                        className="fs-nav-item"
                        onClick={() => localStorage.removeItem("token")}
                    >

                        <LogOut size={18} />
                        Logout

                    </a>

                </div>

            </aside>



            {/* MAIN */}

            <main className="fs-main">


                <header className="fs-topbar">

                    <div className="fs-breadcrumb">

                        <Columns size={16} />

                        <span>SurplusX</span>

                    </div>

                </header>



                <div className="fs-content">


                    <div className="fs-page-header">

                        <h1>

                            <MapIcon size={24} />
                            Hunger Map

                        </h1>

                        <p>
                            Live NGO Requests with Real Coordinates
                        </p>

                    </div>



                    {/* REAL MAP */}


                    <div
                        style={{
                            height: "450px",
                            borderRadius: "16px",
                            overflow: "hidden",
                            marginBottom: "30px"
                        }}
                    >


                        <MapContainer

                            center={center}

                            zoom={5}

                            style={{ height: "100%" }}

                        >

                            <TileLayer

                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                            />



                            {

                                ngos.map((ngo) => {

                                    if (!ngo.coordinates) return null;


                                    return (

                                        <CircleMarker

                                            key={ngo._id}

                                            center={[

                                                ngo.coordinates.latitude,

                                                ngo.coordinates.longitude

                                            ]}

                                            radius={12}

                                            pathOptions={{

                                                color:

                                                    getSeverity(ngo) === "High"

                                                        ? "red" :

                                                        getSeverity(ngo) === "Medium"

                                                            ? "orange"

                                                            : "green"

                                            }}

                                        >

                                            <Popup>

                                                <h3>{ngo.ngoName}</h3>

                                                <p>{ngo.location}</p>

                                                <p>

                                                    Food :

                                                    {ngo.foodType}

                                                </p>

                                                <p>

                                                    Category :

                                                    {ngo.foodCategory}

                                                </p>

                                                <p>

                                                    Quantity :

                                                    {ngo.quantity}

                                                </p>

                                                <p>

                                                    Capacity :

                                                    {ngo.currentLoad}

                                                    /

                                                    {ngo.totalCapacity}

                                                </p>

                                            </Popup>

                                        </CircleMarker>

                                    )

                                })

                            }


                        </MapContainer>

                    </div>



                    {/* NGO CARDS */}



                    <div className="hm-cards-grid">


                        {

                            loading ?

                                <h3>Loading...</h3>

                                :


                                ngos.map((ngo) => {

                                    const severity = getSeverity(ngo);

                                    const colorClass = getColorClass(severity);


                                    return (

                                        <div

                                            key={ngo._id}

                                            className={`hm-card ${colorClass}`}

                                        >


                                            <div className="hm-card-header">


                                                <h3>

                                                    {ngo.ngoName},

                                                    {ngo.location}

                                                </h3>


                                                <span

                                                    className={`hm-badge ${colorClass}`}

                                                >

                                                    <AlertTriangle size={14} />

                                                    {severity}

                                                </span>


                                            </div>



                                            <div className="hm-card-body">


                                                <div className="hm-card-stat">

                                                    <Users size={16} />

                                                    Capacity :

                                                    {ngo.totalCapacity}

                                                </div>


                                                <div className="hm-card-stat">

                                                    <TrendingDown size={16} />

                                                    Food Needed :

                                                    {ngo.quantity}

                                                </div>



                                                <div className="hm-card-stat">

                                                    Required Date :

                                                    {new Date(
                                                        ngo.requiredDate
                                                    ).toLocaleDateString()}

                                                </div>


                                            </div>

                                        </div>

                                    )

                                })

                        }


                    </div>


                </div>

            </main>

        </div>

    );

}