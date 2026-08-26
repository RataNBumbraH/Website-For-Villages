import { useEffect, useState } from "react";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    contactno: "",
    address: "",
    qualification: "",
    age: "",
    role: "user",
    profilePic: "" // 📸 Profile picture state (Base64 or empty string)
  });

  /* ================= FETCH USERS ================= */

  const fetchUsers = () => {
    fetch("https://website-for-villages-backend.onrender.com/admin/users", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE USER ================= */

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    await fetch(`https://website-for-villages-backend.onrender.com/admin/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    fetchUsers();
  };

  /* ================= START EDIT ================= */

  const startEdit = (user) => {
    setEditingUser(user._id);

    setForm({
      username: user.username || user.name || "",
      contactno: user.contactno || "",
      address: user.address || "",
      qualification: user.qualification || "",
      age: user.age || "",
      role: user.role || "user",
      profilePic: user.profilePic || ""
    });
  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE FILE UPLOAD (Base64) ================= */

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  /* ================= REMOVE PICTURE ================= */

  const handleRemovePic = () => {
    const confirmRemove = window.confirm("Are you sure you want to remove this profile picture?");
    if (!confirmRemove) return;
    setForm({ ...form, profilePic: "" }); // 👈 Clears profilePic in form state
  };

  /* ================= UPDATE USER ================= */

  const updateUser = async (e) => {
    e.preventDefault();

    await fetch(`https://website-for-villages-backend.onrender.com/admin/user/${editingUser}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(form)
    });

    setEditingUser(null);
    fetchUsers();
  };

  /* ================= UI ================= */

  return (
    <div>
      <h1>Users Management</h1>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Profile Pic</th>
            <th>Name</th>
            <th>Contact No</th>
            <th>Address</th>
            <th>Qualification</th>
            <th>Age</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>
                <img 
                  src={user.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                  alt="avatar" 
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
                />
              </td>
              <td>{user.username || user.name}</td>
              <td>{user.contactno}</td>
              <td>{user.address}</td>
              <td>{user.qualification}</td>
              <td>{user.age}</td>
              <td>
                <span className={`role ${user.role}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <button onClick={() => startEdit(user)} style={{ marginRight: "5px" }}>Edit</button>
                <button onClick={() => deleteUser(user._id)} style={{ background: "#fee2e2", color: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= EDIT FORM ================= */}
      {editingUser && (
        <div style={{ marginTop: "20px", padding: "20px", background: "#f3f4f6", borderRadius: "8px" }}>
          <h2>Edit User / Village Head</h2>
          <form onSubmit={updateUser} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
            
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Name"
              required
            />

            <input
              name="contactno"
              value={form.contactno}
              minLength={10}
              maxLength={10}
              onChange={handleChange}
              placeholder="Contact"
              required
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              required
            />

            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="Qualification"
              required
            />

            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />

            {/* 📸 Profile Picture Upload & Remove Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label><strong>Profile Picture:</strong></label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img 
                  src={form.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                  alt="Preview" 
                  style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
                />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ flex: 1 }}
                />
              </div>

              {/* Remove Picture Button */}
              {form.profilePic && (
                <button 
                  type="button" 
                  onClick={handleRemovePic}
                  style={{ background: "#fee2e2", color: "red", border: "1px solid red", padding: "5px", cursor: "pointer", marginTop: "5px" }}
                >
                  Remove Picture
                </button>
              )}
            </div>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="villagehead">Village Head</option>
              <option value="admin">Admin</option>
            </select>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" style={{ background: "green", color: "#fff", padding: "8px 12px", border: "none", cursor: "pointer" }}>Update User</button>
              <button type="button" onClick={() => setEditingUser(null)} style={{ padding: "8px 12px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}