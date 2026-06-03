import { useEffect, useState } from "react";

export default function AssignVillage() {

  const [users, setUsers] = useState([]);
  const [villages, setVillages] = useState([]);

  const [userId, setUserId] = useState("");
  const [villageId, setVillageId] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 fetch users
  useEffect(() => {
    fetch("https://website-for-villages-backend.onrender.com/admin/users", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [token]);

  // 🔹 fetch villages
  useEffect(() => {
    fetch("https://website-for-villages-backend.onrender.com/admin/villages", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => setVillages(data));
  }, [token]);

  // 🔥 ASSIGN FUNCTION
  const assignVillage = async () => {

    if (!userId || !villageId) {
      alert("Select both fields");
      return;
    }

    const res = await fetch("https://website-for-villages-backend.onrender.com/admin/assign-village", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ userId, villageId })
    });

    const data = await res.json();

    alert(data.message);

  };

  return (
  <div className="assign-page">
    <h1>Assign Village to Villagehead</h1>

    {/* USER DROPDOWN */}
    <select onChange={(e) => setUserId(e.target.value)}>
      <option>Select Villagehead</option>
      {users
        .filter(u => u.role === "villagehead")
        .map(u => (
          <option key={u._id} value={u._id}>
            {u.username}
          </option>
        ))}
    </select>

    {/* VILLAGE DROPDOWN */}
    <select onChange={(e) => setVillageId(e.target.value)}>
      <option>Select Village</option>
      {villages.map(v => (
        <option key={v._id} value={v._id}>
          {v.name}
        </option>
      ))}
    </select>

    <button onClick={assignVillage}>Assign</button>
  </div>
);
}