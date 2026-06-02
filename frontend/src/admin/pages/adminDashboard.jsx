import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchDashboard = async () => {
      try {

        const res = await fetch("http://localhost:5000/admin/dashboard", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await res.json();
        setStats(data);

      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Unable to load dashboard");

      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>

      <h1>Admin Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px",
        flexWrap: "wrap"
      }}>

        {/* Villages */}
        <div className="card" onClick={() => navigate("/admin/villages")}>
          <h3>Total Villages</h3>
          <p>{stats.villages || 0}</p>
        </div>

        {/* Users */}
        <div className="card" onClick={() => navigate("/admin/users")}>
          <h3>Total Users</h3>
          <p>{stats.users || 0}</p>
        </div>

        {/* Camps */}
        <div className="card" onClick={() => navigate("/admin/camps")}>
          <h3>Camps</h3>
          <p>{stats.camps || 0}</p>
        </div>

        {/* Camps */}
        <div className="card" onClick={() => navigate("/admin/camp-request")}>
          <h3>Camp Requests</h3>
          <p>{stats.camprequest || 0}</p>
        </div>

        {/* Feedback */}
        <div className="card" onClick={() => navigate("/admin/feedback")}>
          <h3>Feedback</h3>
          <p>{stats.feedback || 0}</p>
        </div>

      </div>

    </div>
  );
}