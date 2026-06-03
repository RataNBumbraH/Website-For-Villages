import { useEffect, useState } from "react";

export default function MyFeedback() {

  const [feedback, setFeedback] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {

    fetch("https://website-for-villages-backend.onrender.com/villagehead/my-feedback", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => setFeedback(data))
      .catch(err => console.log(err));

  }, [token]);

  return (
    <div className="my-requests-page">
      <h2>My Feedback History</h2>
      {feedback.length === 0 && <p>No feedback sent yet</p>}
      {feedback.map(f => (
        <div key={f._id} className="my-request-card">
          <h3>{f.camp?.title || "N/A"}</h3>
          <p><strong>Your Message:</strong> {f.message}</p>
          <span className={`status-badge ${f.status}`}>{f.status}</span>
          <div className="admin-reply">  {/* ⚠️ NEW CLASS — add to CSS (see below) */}
            <strong>Admin Reply</strong>
            <p>{f.reply || "No reply yet (waiting for admin response)"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}