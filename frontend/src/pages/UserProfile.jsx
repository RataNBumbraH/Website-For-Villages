import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    contactno: "",
    address: "",
    qualification: "",
    age: "",
    profilePic: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    const token = localStorage.getItem("token");
    fetch("https://website-for-villages-backend.onrender.com/user/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({
          username: data.username || data.name || "",
          contactno: data.contactno || "",
          address: data.address || "",
          qualification: data.qualification || "",
          age: data.age || "",
          profilePic: data.profilePic || ""
        });
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const dataurl = canvas.toDataURL("image/jpeg", 0.7);
          setForm({ ...form, profilePic: dataurl });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://website-for-villages-backend.onrender.com/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.log(err);
      alert("Error updating profile");
    }
  };

  if (!profile) return <p style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif", color: "#555" }}>Loading profile...</p>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <Navbar />
      
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "30px", background: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontFamily: "sans-serif" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaeaea", paddingBottom: "15px", marginBottom: "25px" }}>
          <h2 style={{ margin: 0, color: "#1f2937", fontSize: "24px" }}>My Profile</h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              style={{ padding: "8px 18px", cursor: "pointer", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", fontSize: "14px", transition: "background 0.2s" }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px", background: "#f8fafc", padding: "20px", borderRadius: "10px" }}>
              <img 
                src={profile.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                alt="Profile" 
                style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "3px solid #e2e8f0" }}
              />
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#1e293b", fontSize: "20px" }}>{profile.username || profile.name}</h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px", textTransform: "capitalize" }}>Role: <strong>{profile.role}</strong></p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Contact No</span>
                <strong style={{ color: "#1e293b", fontSize: "15px" }}>{profile.contactno || "Not Provided"}</strong>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Age</span>
                <strong style={{ color: "#1e293b", fontSize: "15px" }}>{profile.age || "Not Provided"}</strong>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "8px", border: "1px solid #e2e8f0", gridColumn: "span 2" }}>
                <span style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Address</span>
                <strong style={{ color: "#1e293b", fontSize: "15px" }}>{profile.address || "Not Provided"}</strong>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "8px", border: "1px solid #e2e8f0", gridColumn: "span 2" }}>
                <span style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Qualification</span>
                <strong style={{ color: "#1e293b", fontSize: "15px" }}>{profile.qualification || "Not Provided"}</strong>
              </div>

              {profile.role === "villagehead" && (
                <div style={{ background: "#f0fdf4", padding: "14px 18px", borderRadius: "8px", border: "1px solid #bbf7d0", gridColumn: "span 2" }}>
                  <span style={{ display: "block", fontSize: "12px", color: "#166534", marginBottom: "4px" }}>Assigned Village</span>
                  <strong style={{ color: "#15803d", fontSize: "15px" }}>{profile.village?.name || "Not Assigned"}</strong>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Profile Picture</label>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img 
                  src={form.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                  alt="Preview" 
                  style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid #cbd5e1" }}
                />
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: "14px", color: "#475569" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Name</label>
              <input name="username" value={form.username} onChange={handleChange} required style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Contact No</label>
                <input name="contactno" value={form.contactno} onChange={handleChange} minLength={10} maxLength={10} required style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Age</label>
                <input name="age" type="number" value={form.age} onChange={handleChange} required style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Address</label>
              <input name="address" value={form.address} onChange={handleChange} required style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Qualification</label>
              <input name="qualification" value={form.qualification} onChange={handleChange} required style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <button type="submit" style={{ flex: 1, padding: "10px", background: "#16a34a", color: "#fff", border: "none", cursor: "pointer", borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: "10px", cursor: "pointer", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f1f5f9", color: "#334155", fontWeight: "600", fontSize: "14px" }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}