import { Link } from "react-router-dom"
import { useState, useEffect } from "react";

export default function AdminSidebar(){
    const userId = localStorage.getItem("userId");
    const [pendingCount, setPendingCount] = useState(0);

    // Pending requests di count fetch karn layi
    useEffect(() => {
      const fetchPendingRequests = async () => {
        try {
          const res = await fetch("https://website-for-villages-backend.onrender.com/admin/camp-request", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          });
          if (res.ok) {
            const data = await res.json();
            // Sirf "pending" status wali requests da count kadd lao
            const pending = data.filter(req => req.status === "pending");
            setPendingCount(pending.length);
          }
        } catch (err) {
          console.log("Error fetching camp requests count:", err);
        }
      };

      fetchPendingRequests();
      
      // Har 10 second baad auto-refresh v ho sakda hai ta je live notification mile
      const interval = setInterval(fetchPendingRequests, 10000);
      return () => clearInterval(interval);
    }, []);

  return(
    <div style={{
      width:"230px",
      minHeight:"110px",
      height:"auto",
      background:"#1f2937",
      color:"#fff",
      padding:"20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>

      <div>
        <h2 style={{marginBottom:"30px"}}>
          Admin Panel
        </h2>

        <nav style={{display:"flex",flexDirection:"column",gap:"15px"}}>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/villages">Manage Villages</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/camps">Camps</Link>
          
          {/* ✅ Camp Requests link with Notification Badge */}
          <Link 
            to="/admin/camp-request" 
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", color: "inherit" }}
          >
            <span>Camp Requests</span>
            {pendingCount > 0 && (
              <span style={{
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                padding: "2px 8px",
                fontSize: "0.75rem",
                fontWeight: "bold"
              }}>
                {pendingCount}
              </span>
            )}
          </Link>

          <Link to="/admin/feedback">Feedback</Link>
          <Link to="/admin/all-requests">All Requests</Link>
          <Link to="/admin/feedback/replied">Replied Feedback</Link>
          <Link to="/admin/assign-village">Assign Village</Link>
        </nav>
      </div>

      {/* 🔄 Wapas User Portal (Home) par jaane ka responsive button */}
      <div style={{marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)"}}>
        <Link 
          to={`/home/${userId}`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "10px 15px",
            background: "linear-gradient(135deg, #c9922a 0%, #e8b84b 100%)",
            color: "#3b2a1a",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "0.9rem",
            textDecoration: "none",
            transition: "all 0.3s ease"
          }}
        >
          ← Go to User Portal
        </Link>
      </div>

    </div>
  )
}