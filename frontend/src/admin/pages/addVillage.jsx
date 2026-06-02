import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AddVillage(){

const navigate = useNavigate()

const [form,setForm] = useState({
  name:"",
  district:"",
  districtcode:"",
  population:"",
  schools:"",
  hospitals:"",
  description:""
})

const [images,setImages] = useState([])

const handleChange = e=>{
  setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = async e=>{
  e.preventDefault()

  try{

    const formData = new FormData()

    // ✅ add text fields
    Object.keys(form).forEach(key=>{
      formData.append(key,form[key])
    })

    // ✅ add images
    for(let i=0;i<images.length;i++){
      formData.append("images", images[i])
    }

    const res = await fetch("http://localhost:5000/admin/addvillage",{
      method:"POST",
      headers:{
        Authorization:"Bearer "+localStorage.getItem("token")
      }, // ❌ DO NOT SET Content-Type
      body: formData
    })

    const data = await res.json()

    if(res.ok){
      alert("Village added successfully")
      navigate("/admin/villages")
    }else{
      alert(data.error)
    }

  }catch(err){
    console.log(err)
  }
}

return(

<form onSubmit={handleSubmit}>

<h2>Add Village</h2>

<input name="name" placeholder="Village Name" onChange={handleChange}/>
<input name="district" placeholder="District" onChange={handleChange}/>
<input name="districtcode" placeholder="District Code" onChange={handleChange}/>
<input name="population" placeholder="Population" onChange={handleChange}/>
<input name="schools" placeholder="Schools" onChange={handleChange}/>
<input name="hospitals" placeholder="Hospitals" onChange={handleChange}/>

<textarea
name="description"
placeholder="Description"
onChange={handleChange}
/>

{/* ✅ FILE UPLOAD INPUT */}
<label>Upload Images</label>
<input
  type="file"
  multiple
  onChange={(e)=>setImages(e.target.files)}
/>

{/* ✅ PREVIEW IMAGES */}
<div>
  {Array.from(images).map((file, i)=>(
    <img
      key={i}
      src={URL.createObjectURL(file)}
      alt="preview"
      style={{width:"100px", margin:"5px"}}
    />
  ))}
</div>

<button type="submit">Add Village</button>

</form>

)
}