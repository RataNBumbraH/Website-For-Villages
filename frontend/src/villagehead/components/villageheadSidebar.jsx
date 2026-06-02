import { Link } from "react-router-dom";

export default function VillageHeadSidebar() {
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

    </div>
  );
}