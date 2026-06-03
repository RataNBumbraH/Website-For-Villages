import { useEffect, useState } from "react";

export default function SendFeedback() {

  const [message, setMessage] = useState("");
  const [campId, setCampId] = useState("");
  const [camps, setCamps] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ FIX: add token in dependency
  useEffect(() => {

    if (!token) return;

    fetch("https://website-for-villages-backend.onrender.com/villagehead/camps", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => setCamps(data))
      .catch(err => console.log(err));

  }, [token]);

  const sendFeedback = async () => {

    if (!campId || !message) {
      alert("Please select camp and write message");
      return;
    }

    const res = await fetch("https://website-for-villages-backend.onrender.com/villagehead/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        message,
        campId
      })
    });

    const data = await res.json();

if (!res.ok) {
  alert(data.error || "Something went wrong");
  return;
}

alert(data.message || "Feedback sent successfully");
  };

   return (
    <div className="send-request-page">
      <div className="send-card">  {/* ⚠️ NEW CLASS — add to CSS (see below) */}
        <h2>Send Feedback</h2>
        <select onChange={(e) => setCampId(e.target.value)}>
          <option value="">Select Camp</option>
          {camps.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <textarea
          placeholder="Write your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-btn" onClick={sendFeedback}>Send Feedback</button>
      </div>
    </div>
  );
}