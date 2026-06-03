import { useEffect, useState } from "react";

export default function AdminFeedback() {

  const [feedback, setFeedback] = useState([]);
  const [reply, setReply] = useState({});

  useEffect(() => {
    fetch("https://website-for-villages-backend.onrender.com/admin/feedback", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setFeedback(data));
  }, []);

  const sendReply = async (id) => {
    await fetch(`https://website-for-villages-backend.onrender.com/admin/feedback/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        reply: reply[id]
      })
    });

    alert("Reply sent");
    window.location.reload();
  };

   return (
    <div className="admin-page">
      <h1>Admin Feedback Panel</h1>
      {feedback.length === 0 && (
        <p className="empty-state">No feedback found.</p>
      )}
      {feedback.map(f => (
        <div key={f._id} className="feedback-card">
          <div className="meta">  {/* ⚠️ NEW CLASS — add to CSS (see below) */}
            <span className="meta-pill">Village: {f.village?.name}</span>  {/* ⚠️ NEW CLASS */}
            <span className="meta-pill">Head: {f.villagehead?.username}</span>
            <span className={`status-badge ${f.status}`}>{f.status}</span>
          </div>
          <h3>{f.camp?.title || "N/A"}</h3>
          <p><strong>Message:</strong> {f.message}</p>
          <div className="reply-area">  {/* ⚠️ NEW CLASS — add to CSS (see below) */}
            <textarea
              placeholder="Write reply..."
              onChange={(e) => setReply({ ...reply, [f._id]: e.target.value })}
            />
            <button className="reply-btn" onClick={() => sendReply(f._id)}>Send Reply</button>
          </div>
        </div>
      ))}
    </div>
  );
}