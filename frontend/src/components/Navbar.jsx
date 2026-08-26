import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  function handleLogout() {
    const confirmLogout = window.confirm("Are you sure you want to Logout?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/auth/login");
    }
  }

  return (
    <header className="navbar">
      {/* 1. Logo Section */}
      <div className="logo">
        Villages Information Portal
      </div>

      {/* 2. Controls & Navigation Links Block */}
      <nav className="nav-links">
        {/* Role based buttons */}
        {role === "admin" && (
          <button 
            className="panel-btn"
            onClick={() => navigate("/admin")}
          >
            Go to Admin Panel
          </button>
        )}

        {role === "villagehead" && (
          <button 
            className="panel-btn"
            onClick={() => navigate("/villagehead")}
          >
            Go to VillageHead Panel
          </button>
        )}

        <Link to="/villages">Villages</Link>

        {/* ⭐ Profile Button Added */}
        <button 
          className="profile-btn" 
          onClick={() => navigate("/user/profile")}
          style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
        >
          Profile 👤
        </button>
        
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;