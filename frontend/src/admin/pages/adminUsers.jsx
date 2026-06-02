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
    role: "user"
  });

  /* ================= FETCH USERS ================= */

  const fetchUsers = () => {
    fetch("http://localhost:5000/admin/users", {
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

    await fetch(`http://localhost:5000/admin/user/${id}`, {
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
      username: user.username || user.name,
      contactno: user.contactno,
      address: user.address,
      qualification: user.qualification,
      age: user.age,
      role: user.role || "user"
    });
  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE USER ================= */

  const updateUser = async (e) => {

    e.preventDefault();

    await fetch(`http://localhost:5000/admin/user/${editingUser}`, {
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

      <h1>Users</h1>

      <table border="1">

        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Contact No</th>
            <th>Address</th>
            <th>Qualification</th>
            <th>Age</th>
            <th>Role</th> {/* FIXED POSITION */}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user, index) => (

            <tr key={user._id}>

              <td>{index + 1}</td>

              <td>{user.username || user.name}</td>
              <td>{user.contactno}</td>
              <td>{user.address}</td>
              <td>{user.qualification}</td>
              <td>{user.age}</td>

              {/* ✅ ROLE DISPLAY */}
              <td>
                <span className={`role ${user.role}`}>
                  {user.role}
                </span>
              </td>

              <td>
                <button onClick={() => startEdit(user)}>Edit</button>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* ================= EDIT FORM ================= */}

      {editingUser && (

        <div>

          <h2>Edit User</h2>

          <form onSubmit={updateUser}>

            <input
              name="username"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              name="contactno"
              value={form.contactno}
              minLength={10}
              maxLength={10}
              onChange={handleChange}
              placeholder="Contact"
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
            />

            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="Qualification"
            />

            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
            />

            {/* ✅ ROLE DROPDOWN */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="villagehead">Village Head</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit">Update User</button>

            <button type="button" onClick={() => setEditingUser(null)}>
              Cancel
            </button>

          </form>

        </div>

      )}

    </div>

  );
}