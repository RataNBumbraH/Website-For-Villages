import { useEffect, useState } from "react";

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

  // 📂 Handle image selection & compression to Base64
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

  // 🔄 Submit updated profile details
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

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2>My Profile</h2>

      {!isEditing ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <img 
              src={profile.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
              alt="Profile" 
              style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ccc" }}
            />
            <button onClick={() => setIsEditing(true)} style={{ padding: "6px 12px", cursor: "pointer", background: "#2563eb", color: "#fff", border: "none", borderRadius: "5px" }}>
              Edit Profile
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#f9fafb", padding: "15px", borderRadius: "8px" }}>
            <p><strong>Name:</strong> {profile.username || profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Contact No:</strong> {profile.contactno || "Not Provided"}</p>
            <p><strong>Address:</strong> {profile.address || "Not Provided"}</p>
            <p><strong>Qualification:</strong> {profile.qualification || "Not Provided"}</p>
            <p><strong>Age:</strong> {profile.age || "Not Provided"}</p>
            <p><strong>Role:</strong> <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{profile.role}</span></p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <label><strong>Profile Picture:</strong></label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img 
              src={form.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
              alt="Preview" 
              style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <label><strong>Name:</strong></label>
          <input name="username" value={form.username} onChange={handleChange} required style={{ padding: "8px" }} />

          <label><strong>Contact No:</strong></label>
          <input name="contactno" value={form.contactno} onChange={handleChange} minLength={10} maxLength={10} required style={{ padding: "8px" }} />

          <label><strong>Address:</strong></label>
          <input name="address" value={form.address} onChange={handleChange} required style={{ padding: "8px" }} />

          <label><strong>Qualification:</strong></label>
          <input name="qualification" value={form.qualification} onChange={handleChange} required style={{ padding: "8px" }} />

          <label><strong>Age:</strong></label>
          <input name="age" type="number" value={form.age} onChange={handleChange} required style={{ padding: "8px" }} />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" style={{ padding: "8px 15px", background: "green", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ padding: "8px 15px", cursor: "pointer", borderRadius: "5px" }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}