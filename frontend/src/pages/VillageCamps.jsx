import {useEffect,useState} from "react"
import {useParams,Link} from "react-router-dom"

export default function VillageCamps(){

const {id} = useParams()
const [camps,setCamps] = useState([])

useEffect(()=>{

const fetchCamps = async()=>{

try{

const res = await fetch(
`http://localhost:5000/village/${id}/camps`
)

const data = await res.json()

setCamps(data)

}catch(err){

console.error("Error loading camps",err)

}

}

fetchCamps()

},[id])

return(

<div>

<h2>Village Camps</h2>

{camps.map(camp=>(

<div key={camp._id} className="camp-card">

<h3>{camp.title}</h3>

<p>{camp.description}</p>

<p>Date: {new Date(camp.date).toLocaleDateString()}</p>

<Link to={`/camp/${camp._id}`}>
<button>View Gallery</button>
</Link>

</div>

))}

</div>

)

}