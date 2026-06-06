import { Link } from "react-router-dom";

export default function VillageHeadSidebar() {
  const userId = localStorage.getItem("userId");
  return (
    <div style={{
      width: "230px",
      minheight: "100vh",
      height: "auto",
      background: "#111827",
      color: "#fff",
      padding: "20px"
    }}>

      <h2 style={{ marginBottom: "30px" }}>VillageHead Panel</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

        {/* ✅ Relative links */}
        <Link to="dashboard">Dashboard</Link>
        <Link to="camp-request">Send Request</Link>
        <Link to="my-request">My Requests</Link>
        <Link to="camps">My Camps</Link>
        <Link to="feedback">Send Feedback</Link>
        <Link to="my-feedback">My Feedback</Link>
      </nav>
      {/* 🔄 Wapas User Portal (Home) par jaane ka responsive button */}
      <div style={{marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)"}}>
        <Link 
          to={`/home/${userId}`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "10px 15px",
            background: "linear-gradient(135deg, #c9922a 0%, #e8b84b 100%)", /* Punjab Gold Theme Tint */
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
  );
}