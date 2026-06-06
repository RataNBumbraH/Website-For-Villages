import { Link } from "react-router-dom"

export default function AdminSidebar(){
    const userId = localStorage.getItem("userId");
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
      justifyContent: "space-between" /* Isse link aur buttons top-bottom stretch ho jayenge */
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
          <Link to="/admin/camp-request">Camp Requests</Link>
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
  )
}