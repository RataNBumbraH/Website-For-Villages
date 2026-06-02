import { useEffect,useState } from "react"
import { Link } from "react-router-dom"

export default function AdminVillages(){

const [villages,setVillages] = useState([])

useEffect(()=>{

fetch("http://localhost:5000/admin/villages",{

headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}

})
.then(res=>res.json())
.then(data=>setVillages(data))

},[])

const deleteVillage = async(id)=>{

if(!window.confirm("Delete village?")) return

await fetch(`http://localhost:5000/admin/villages/${id}`,{

method:"DELETE",

headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}

})

setVillages(villages.filter(v=>v._id!==id))

}

return(

<div>

<h1>Manage Villages</h1>

<Link to="/admin/addvillage">
<button>Add Village</button>
</Link>

<table border="1" cellPadding="10">

<thead>

<tr>
<th>Sr No</th>
<th>District Code</th>
<th>Name</th>
<th>District</th>
<th>Population</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{villages.map((village,index)=>(

<tr key={village._id}>

<td>{index + 1}</td>
<td>{village.districtcode}</td>
<td>{village.name}</td>
<td>{village.district}</td>
<td>{village.population}</td>

<td>

<Link to={`/admin/editvillage/${village._id}`}>
<button>Edit</button>
</Link>

<button
onClick={()=>deleteVillage(village._id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}