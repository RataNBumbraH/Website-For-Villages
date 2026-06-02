import { useEffect, useState } from "react";

export default function MyRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:5000/villagehead/my-request", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await res.json();
        setRequests(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // 🔄 Loading State
  if (loading) {
    return <p>Loading requests...</p>;
  }

  // ❌ Error State
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Camp Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        requests.map((r) => (
          <div
            key={r._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <h3>{r.title}</h3>
            <p>{r.description}</p>

            <p>
              Status:{" "}
              <span
                style={{
                  color:
                    r.status === "approved"
                      ? "green"
                      : r.status === "rejected"
                      ? "red"
                      : "orange",
                  fontWeight: "bold"
                }}
              >
                {r.status}
              </span>
            </p>

            <p>
              <strong>Admin Reply:</strong>{" "}
              {r.adminReply || "No reply yet"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}