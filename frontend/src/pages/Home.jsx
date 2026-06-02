import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {

const [villages, setVillages] = useState([]);
const [shuffledVillages, setShuffledVillages] = useState([]);
const [error, setError] = useState("");
const [totalCamps, setTotalCamps] = useState(0);

const navigate = useNavigate();

// ── Fetch Villages ──
useEffect(() => {
  const fetchVillages = async () => {
    try {
      const res = await fetch("http://localhost:5000/villages");
      if (!res.ok) throw new Error("Failed to fetch villages");
      const data = await res.json();
      setVillages(data);
    } catch (err) {
      setError(err.message);
    }
  };
  fetchVillages();
}, []);

// ── Fetch Camps Count ──
useEffect(() => {
  const fetchCampsCount = async () => {
    try {
      const res = await fetch("http://localhost:5000/camps/count");
      const data = await res.json();
      setTotalCamps(data.count);
    } catch (err) {
      console.error(err);
    }
  };
  fetchCampsCount();
}, []);

// ── Shuffle ──
const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

useEffect(() => {
  setShuffledVillages(shuffle(villages));
}, [villages]);

useEffect(() => {
  const interval = setInterval(() => {
    setShuffledVillages(prev => shuffle(prev));
  }, 5000);
  return () => clearInterval(interval);
}, []);

// ── Computed Stats ──
const totalPopulation = villages.reduce((s, v) => s + (Number(v.population) || 0), 0);

const mostPopulated = villages.length
  ? villages.reduce((a, b) =>
      Number(a.population) > Number(b.population) ? a : b)
  : null;

const leastPopulated = villages.length
  ? villages.reduce((a, b) =>
      Number(a.population) < Number(b.population) ? a : b)
  : null;

return (
<div>
  <Navbar />

  {/* ── HERO ── */}
  <section className="hero">
    <h1>Welcome to Village Information Portal</h1>

    {/* 🔥 ROLE BUTTONS */}
    

    {/* Stats Pills */}
    <div className="hero-stats">
      <span className="hero-pill">Total Villages: {villages.length}</span>
      <span className="hero-pill">
        Total Population: {totalPopulation.toLocaleString()}
      </span>
    </div>

    {/* Highlight Cards */}
    <div className="highlight-row">

      <div className="highlight-card">
        <span className="hl-num">{totalCamps}</span>
        <span className="hl-label">Total Camps Held</span>
      </div>

      <div className="highlight-card most">
        <span className="hl-num">{mostPopulated?.name || "—"}</span>
        <span className="hl-label">Most Populated</span>
        <span className="hl-sub">
          {mostPopulated
            ? Number(mostPopulated.population).toLocaleString() + " people"
            : ""}
        </span>
      </div>

      <div className="highlight-card least">
        <span className="hl-num">{leastPopulated?.name || "—"}</span>
        <span className="hl-label">Least Populated</span>
        <span className="hl-sub">
          {leastPopulated
            ? Number(leastPopulated.population).toLocaleString() + " people"
            : ""}
        </span>
      </div>

    </div>
  </section>

  {error && <p style={{ color: "red" }}>{error}</p>}

  {/* ── VILLAGES ── */}
  <section className="villages">
    <h2>Explore Our Villages</h2>

    <div className="village-container">
      {shuffledVillages.map((village, index) => (
        <div className="card" key={index}>
          <img
            src={`http://localhost:5000/uploads/${village.highlightImages?.[0]}`}
            alt={village.name}
          />
          <h3 style={{fontSize: "1.4rem"}}>{village.name}</h3>
          <p style={{fontSize:"1.0rem"}}>{village.district}</p>
          <button onClick={() => navigate(`/village/${village._id}`)}>
            View Details
          </button>
        </div>
      ))}
    </div>
  </section>
<footer className="footer">

<p>© 2026 Village Information Portal</p>

</footer>
</div>
);
}
