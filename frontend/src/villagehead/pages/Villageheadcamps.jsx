import { useEffect, useState } from "react";

export default function VillageHeadCamps() {

  const [camps, setCamps] = useState([]);

  useEffect(() => {
  const fetchCamps = async () => {
    try {
      const res = await fetch("https://website-for-villages-backend.onrender.com/villagehead/camps", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("API Error:", errData.message);
        setCamps([]); // prevent crash
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        setCamps([]);
        return;
      }

      setCamps(data);

    } catch (error) {
      console.error("Fetch error:", error);
      setCamps([]);
    }
  };

  fetchCamps();
}, []);
  return (
    <div style={{ padding: "20px" }}>

      <h2>Approved Camps</h2>

      {camps.length === 0 && <p>No camps scheduled yet</p>}

      {camps.map(c => (
        <div key={c._id} style={{
          border: "1px solid gray",
          margin: "10px",
          padding: "10px",
          borderRadius: "8px"
        }}>

          <h3>{c.title}</h3>
          <p>{c.description}</p>

          <p>
            📅 Date:{" "}
            <strong>
              {new Date(c.date).toLocaleDateString()}
            </strong>
          </p>

        </div>
      ))}

    </div>
  );
}