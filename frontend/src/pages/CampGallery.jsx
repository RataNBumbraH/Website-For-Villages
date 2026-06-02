// import {useEffect,useState} from "react"
// import {useParams} from "react-router-dom"

// export default function CampGallery(){

// const {id}=useParams()

// const [camp,setCamp]=useState(null)

// useEffect(()=>{

// fetch(`http://localhost:5000/camp/${id}`)
// .then(res=>res.json())
// .then(data=>setCamp(data))

// },[id])

// if(!camp){
// return <h2>Loading Camp...</h2>
// }

// return(

// <div className="camp-page">

// <h1>{camp.title}</h1>

// <p className="camp-date">
// Date: {new Date(camp.date).toLocaleDateString()}
// </p>

// <p className="camp-desc">
// {camp.description}
// </p>

// <div className="camp-gallery">

// {camp.images.map((img,i)=>(

// <img
// key={i}
// src={`http://localhost:5000/uploads/${img}`}
// alt="camp"
// className="gallery-img"
// />

// ))}

// </div>

// </div>

// )

// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CampGallery() {

  const { id } = useParams();
  const [camp, setCamp] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/camp/${id}`)
      .then(res => res.json())
      .then(data => setCamp(data));
  }, [id]);

  // ── Auto slideshow ──
  useEffect(() => {
    if (!camp?.images?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        (prev + 1) % camp.images.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [camp]);

  if (!camp) return <h2>Loading Camp...</h2>;

  return (
    <div className="camp-page">

      <h1>{camp.title}</h1>

      <p className="camp-date">
        Date: {new Date(camp.date).toLocaleDateString()}
      </p>

      <p className="camp-desc">{camp.description}</p>

      {/* ── MAIN SLIDESHOW IMAGE ── */}
      <div className="camp-main-image">
        {camp.images?.length ? (
          <img
            src={`http://localhost:5000/uploads/${camp.images[currentIndex]}`}
            alt="camp"
            className="main-camp-img"
          />
        ) : (
          <p>No Images</p>
        )}
      </div>

      {/* ── THUMBNAILS ── */}
      <div className="camp-gallery">

        {camp.images?.map((img, i) => (
          <img
            key={i}
            src={`http://localhost:5000/uploads/${img}`}
            alt="camp"
            className={`gallery-img ${i === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}

      </div>

    </div>
  );
}