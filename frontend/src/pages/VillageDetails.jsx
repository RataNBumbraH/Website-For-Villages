import { useParams, Link, } from "react-router-dom";
import { useEffect, useState } from "react";

export default function VillageDetails(){

const { id } = useParams();
const [village, setVillage] = useState(null);

useEffect(() => {

const fetchVillage = async () => {

try {

const res = await fetch(`http://localhost:5000/village/${id}`,{
headers:{ 
Authorization: `Bearer ${localStorage.getItem("token")}`
}
});

if(!res.ok){
throw new Error("Failed to fetch village data");
}

const data = await res.json();
setVillage(data);

} catch(err){
console.log("Error fetching village:", err);
}

};

fetchVillage();

}, [id]);

if(!village){
return <h2 className="loading">Loading village details...</h2>
}

return(

<div className="village-detail-page">

<div className="top-section">
<Link to="/villages">
<button className="back-btn">⬅ Back to Villages</button>
</Link>
</div>

<div className="village-card-detail">

<h1 className="village-name">
{village.name}
</h1>

{/* ✅ IMAGE GALLERY */}
<div className="gallery">
{village.highlightImages?.length > 0 ? (
village.highlightImages.map((img, i)=>(
<img
key={i}
src={`http://localhost:5000/uploads/${img}`}
alt="village"
style={{width:"200px", margin:"10px"}}
/>
))
) : (
<p>No images available</p>
)}
</div>

<div className="village-info">

<div className="info-box">
<h3>District</h3>
<p>{village.district}</p>
</div>

<div className="info-box">
<h3>District Code</h3>
<p>{village.districtcode}</p>
</div>

<div className="info-box">
<h3>Population</h3>
<p>{village.population}</p>
</div>

<div className="info-box">
<h3>Schools</h3>
<p>{village.schools}</p>
</div>

<div className="info-box">
<h3>Hospitals</h3>
<p>{village.hospitals}</p>
</div>

</div>

<div className="description-box">
<h3>About Village</h3>
<p>{village.description}</p>
</div>

<Link to={`/village/${village._id}/camps`}>
<button>
View Camps
</button>
</Link>

</div>

</div>

)

}