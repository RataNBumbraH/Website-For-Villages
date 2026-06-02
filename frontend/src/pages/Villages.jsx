import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Villages() {

  const [villages, setVillages] = useState([]);
  const [search, setSearch] = useState("");
  const [randomImages, setRandomImages] = useState({});

  const userId = localStorage.getItem("userId");

  // ── Fetch villages ──
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const res = await fetch("http://localhost:5000/villages", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();
        setVillages(data);
      } catch (err) {
        console.log("Error fetching villages:", err);
      }
    };

    fetchVillages();
  }, []);

  // ── Random image updater ──
  useEffect(() => {
    const updateRandomImages = () => {
      const newImages = {};

      villages.forEach(village => {
        if (village.highlightImages?.length) {
          const randomIndex = Math.floor(
            Math.random() * village.highlightImages.length
          );

          newImages[village._id] = village.highlightImages[randomIndex];
        }
      });

      setRandomImages(newImages);
    };

    updateRandomImages(); // initial load

    const interval = setInterval(updateRandomImages, 4000); // change every 4s

    return () => clearInterval(interval);
  }, [villages]);

  // ── Search filter ──
  const filteredVillages = (villages || []).filter(village =>
    village.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Link to={`/home/${userId}`}>
        <button className="back-btn">Back to Home</button>
      </Link>

      <div className="villages-page">

        <Link to="/villages">
          <h1 className="page-title">Explore Villages</h1>
        </Link>

        <input
          className="search-box"
          type="text"
          placeholder="Search village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="villages-container">

          {filteredVillages.map((village) => (
            <div className="village-card" key={village._id}>

              <h2>{village.name}</h2>
              <p><b>District:</b> {village.district}</p>
              <p><b>Population:</b> {village.population}</p>

              <img
                src={
                  randomImages[village._id]
                    ? `http://localhost:5000/uploads/${randomImages[village._id]}`
                    : "/placeholder.png"
                }
                alt={village.name}
              />

              <Link to={`/village/${village._id}`}>
                <button className="details-btn">View Details</button>
              </Link>

            </div>
          ))}

        </div>
      </div>
    </>
  );
}