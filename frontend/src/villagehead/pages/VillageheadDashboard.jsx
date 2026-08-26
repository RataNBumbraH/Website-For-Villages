import { useEffect, useState } from "react";

export default function VillageHeadDashboard() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedImage, setSelectedImage] = useState(""); 
  const [isEditing, setIsEditing] = useState(false);

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

  // 📂 Function to handle file selection (Base64 conversion)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔄 Function to update profile picture
  const handleUpdatePic = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image file first!");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://website-for-villages-backend.onrender.com/villagehead/update-pic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ profilePic: selectedImage }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setIsEditing(false);
        setSelectedImage("");
        alert("Profile picture updated!");
      } else {
        alert(data.message || "Failed to update picture");
      }
    } catch (err) {
      console.log(err);
      alert("Error updating picture");
    }
  };

  // ❌ Function to remove profile picture
  const handleRemovePic = async () => {
    const confirmRemove = window.confirm("Are you sure you want to remove your profile picture?");
    if (!confirmRemove) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://website-for-villages-backend.onrender.com/villagehead/update-pic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ profilePic: "" }), // 👈 Empty string to clear picture
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setIsEditing(false);
        alert("Profile picture removed!");
      } else {
        alert(data.message || "Failed to remove picture");
      }
    } catch (err) {
      console.log(err);
      alert("Error removing picture");
    }
  };

  if (!profile) return <p>Loading dashboard...</p>;

  const total = requests.length;
  const approved = requests.filter(r => r.status === "approved").length;
  const pending = requests.filter(r => r.status === "pending").length;
  const rejected = requests.filter(r => r.status === "rejected").length;

  return (
    <div>
      <h1>VillageHead Dashboard</h1>

      {/* 👤 Profile Info with Picture & Remove Option */}
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
          
          {/* Action Buttons */}
          {!isEditing ? (
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
              <button 
                onClick={() => setIsEditing(true)}
                style={{ padding: "5px 10px", cursor: "pointer" }}
              >
                Change Picture
              </button>

              {/* ✅ Remove Picture Button (Only shows if profilePic exists) */}
              {profile.profilePic && (
                <button 
                  onClick={handleRemovePic}
                  style={{ padding: "5px 10px", background: "#fee2e2", color: "red", border: "1px solid red", cursor: "pointer" }}
                >
                  Remove Picture
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleUpdatePic} style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                style={{ padding: "5px", flex: 1, minWidth: "200px" }}
                required
              />
              <button type="submit" style={{ padding: "5px 10px", background: "green", color: "#fff", border: "none", cursor: "pointer" }}>
                Upload & Save
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