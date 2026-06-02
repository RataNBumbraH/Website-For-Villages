import { useEffect, useState } from "react";

export default function AdminFeedbackHistory() {

  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/feedback/replied", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setFeedback(data));
  }, []);

  return (
    <div className="admin-page">
      <h1>Replied Feedback</h1>

      {feedback.length === 0 && (
        <p className="empty-state">No replied feedback found.</p>
      )}

      {feedback.map(f => (
        <div key={f._id} className="feedback-card">

          <div className="meta">
            <span className="meta-pill">Village: {f.village?.name}</span>
            <span className="meta-pill">Head: {f.villagehead?.username}</span>
            <span className="status-badge replied">Replied</span>
          </div>

          <h3>{f.camp?.title || "N/A"}</h3>

          <p><strong>Message:</strong> {f.message}</p>
          <p><strong>Reply:</strong> {f.reply}</p>

        </div>
      ))}
    </div>
  );
}