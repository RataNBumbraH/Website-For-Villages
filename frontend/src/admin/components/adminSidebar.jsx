import { Link } from "react-router-dom"

export default function AdminSidebar(){

return(

<div style={{
width:"230px",
minheight:"110px",
height:"auto",
background:"#1f2937",
color:"#fff",
padding:"20px"
}}>

<h2 style={{marginBottom:"30px"}}>
Admin Panel
</h2>

<nav style={{display:"flex",flexDirection:"column",gap:"15px"}}>

<Link to="/admin/dashboard">Dashboard</Link>

<Link to="/admin/villages">Manage Villages</Link>

<Link to="/admin/users">Users</Link>

<Link to="/admin/camps">Camps</Link>

<Link to="/admin/camp-request">Camp Requests</Link>

<Link to="/admin/feedback">Feedback</Link>

<Link to="/admin/all-requests">All Requests</Link>

<Link to="/admin/feedback/replied">Replied Feedback</Link>

<Link to="/admin/assign-village">Assign Village</Link>

</nav>

</div>

)

}