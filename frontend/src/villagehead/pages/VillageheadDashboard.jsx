import { useEffect, useState } from "react";

export default function VillageHeadDashboard() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔹 Fetch profile
    fetch("http://localhost:5000/villagehead/profile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));

    // 🔹 Fetch requests
    fetch("http://localhost:5000/villagehead/my-request", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  if (!profile) return <p>Loading dashboard...</p>;

  // 📊 Stats
  const total = requests.length;
  const approved = requests.filter(r => r.status === "approved").length;
  const pending = requests.filter(r => r.status === "pending").length;
  const rejected = requests.filter(r => r.status === "rejected").length;

  return (
    <div>

      <h1>VillageHead Dashboard</h1>

      {/* 👤 Profile Info */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <h2>Profile Info</h2>

        <p><strong>Name:</strong> {profile.username}</p>
        <p><strong>Village:</strong> {profile.village?.name || "Not Assigned"}</p>
      </div>

      {/* 📊 Stats Cards */}
      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
      }}>

        <div style={cardStyle}>
          <h3>Total Requests</h3>
          <p>{total}</p>
        </div>

        <div style={{ ...cardStyle, background: "#e0f2fe" }}>
          <h3>Approved</h3>
          <p>{approved}</p>
        </div>

        <div style={{ ...cardStyle, background: "#fef3c7" }}>
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <div style={{ ...cardStyle, background: "#fee2e2" }}>
          <h3>Rejected</h3>
          <p>{rejected}</p>
        </div>

      </div>

    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  minWidth: "150px",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
};