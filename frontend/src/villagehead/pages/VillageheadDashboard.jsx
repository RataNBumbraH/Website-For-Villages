import { useEffect, useState } from "react";

export default function VillageHeadDashboard() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [newPicUrl, setNewPicUrl] = useState(""); // 📸 New state for image URL
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

  useEffect(() => {
    fetchProfile();
    fetchRequests();
  }, []);

  const fetchProfile = () => {
    const token = localStorage.getItem("token");
    fetch("https://website-for-villages-backend.onrender.com/villagehead/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setNewPicUrl(data.profilePic || "");
      });
  };

  const fetchRequests = () => {
    const token = localStorage.getItem("token");
    fetch("https://website-for-villages-backend.onrender.com/villagehead/my-request", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data));
  };

  // 🔄 Function to update profile picture
  const handleUpdatePic = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://website-for-villages-backend.onrender.com/villagehead/update-pic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ profilePic: newPicUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setIsEditing(false);
        alert("Profile picture updated!");
      } else {
        alert(data.message || "Failed to update picture");
      }
    } catch (err) {
      console.log(err);
      alert("Error updating picture");
    }
  };

  if (!profile) return <p>Loading dashboard...</p>;

  // 📊 Stats
  const total = requests.length;
  const approved = requests.filter(r => r.status === "approved").length;
  const pending = requests.filter(r => r.status === "pending").length;
  const rejected = requests.filter(r => r.status === "rejected").length;

  return (
    <div>
      <h1>VillageHead Dashboard</h1>

      {/* 👤 Profile Info with Picture & Update Option */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        {/* Profile Picture Display */}
        <img 
          src={profile.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
          alt="Profile" 
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ccc"
          }}
        />

        <div style={{ flex: 1 }}>
          <h2>Profile Info</h2>
          <p><strong>Name:</strong> {profile.username}</p>
          <p><strong>Village:</strong> {profile.village?.name || "Not Assigned"}</p>
          
          {/* Toggle Edit Button */}
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
            >
              Change Picture
            </button>
          ) : (
            <form onSubmit={handleUpdatePic} style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input 
                type="text" 
                placeholder="Paste Image URL here" 
                value={newPicUrl}
                onChange={(e) => setNewPicUrl(e.target.value)}
                style={{ padding: "5px", flex: 1, minWidth: "200px" }}
                required
              />
              <button type="submit" style={{ padding: "5px 10px", background: "green", color: "#fff", border: "none", cursor: "pointer" }}>
                Save
              </button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ padding: "5px 10px", cursor: "pointer" }}>
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
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