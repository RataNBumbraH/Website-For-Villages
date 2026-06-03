// import {useState,useEffect} from "react"

// export default function CreateCamp(){

// const [title,setTitle]=useState("")
// const [description,setDescription]=useState("")
// const [village,setVillage]=useState("")
// const [date,setDate]=useState("")
// const [images,setImages]=useState([])
// const [villages,setVillages]=useState([])

// /* LOAD VILLAGES */

// useEffect(()=>{

// fetch("https://website-for-villages-backend.onrender.com/villages")
// .then(res=>res.json())
// .then(data=>setVillages(data))

// },[])

// const submit = async(e)=>{

// e.preventDefault()

// try{

// const formData = new FormData()

// formData.append("title",title)
// formData.append("description",description)
// formData.append("village",village)
// formData.append("date",date)

// for(let i=0;i<images.length;i++){
// formData.append("images",images[i])
// }

// await fetch("https://website-for-villages-backend.onrender.com/admin/create-camp",{

// method:"POST",

// headers:{
// Authorization:"Bearer "+localStorage.getItem("token")
// },

// body:formData

// })

// alert("Camp Created")

// }catch(err){

// console.error(err)

// }

// }

// return(

// <form onSubmit={submit}>

// <h2>Create Camp</h2>

// <input
// placeholder="Title"
// onChange={e=>setTitle(e.target.value)}
// />

// <textarea
// placeholder="Description"
// onChange={e=>setDescription(e.target.value)}
// />

// {/* VILLAGE DROPDOWN */}

// <select onChange={e=>setVillage(e.target.value)}>

// <option>Select Village</option>

// {villages.map(village=>(

// <option
// key={village._id}
// value={village._id}
// >

// {village.name}

// </option>

// ))}

// </select>

// <input
// type="date"
// onChange={e=>setDate(e.target.value)}
// />

// <input
// type="file"
// multiple
// onChange={e=>setImages(e.target.files)}
// />

// <button>Create Camp</button>

// </form>

// )

// }
import { useState, useEffect } from "react";

export default function CreateCamp() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [village, setVillage] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    fetch("https://website-for-villages-backend.onrender.com/villages")
      .then(res => res.json())
      .then(data => setVillages(data));
  }, []);

  // ── Image preview handler ──
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreview(previewUrls);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("village", village);
      formData.append("date", date);

      images.forEach(img => {
        formData.append("images", img);
      });

      await fetch("https://website-for-villages-backend.onrender.com/admin/create-camp", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: formData
      });

      alert("Camp Created");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={submit} className="camp-form">

      <h2>Create Camp</h2>

      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />

      <textarea
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />

      <select onChange={e => setVillage(e.target.value)}>
        <option>Select Village</option>
        {villages.map(v => (
          <option key={v._id} value={v._id}>
            {v.name}
          </option>
        ))}
      </select>

      <input type="date" onChange={e => setDate(e.target.value)} />

      <input type="file" multiple onChange={handleImages} />

      {/* ── Preview images ── */}
      <div className="preview-container">
        {preview.map((img, i) => (
          <img key={i} src={img} alt="preview" className="preview-img" />
        ))}
      </div>

      <button type="submit">Create Camp</button>

    </form>
  );
}