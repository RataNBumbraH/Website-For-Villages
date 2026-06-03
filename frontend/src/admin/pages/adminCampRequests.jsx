import { useEffect,useState } from "react"

export default function AdminCampRequests(){

const [requests,setRequests] = useState([])

useEffect(()=>{

fetch("https://website-for-villages-backend.onrender.com/admin/camp-request",{

headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}

})
.then(res=>res.json())
.then(data=>setRequests(data))

},[])

const approve = async(id)=>{

await fetch(
`https://website-for-villages-backend.onrender.com/admin/camp-request/${id}/approve`,
{
method:"PUT",
headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}
})

alert("Approved")

}

const reject = async(id)=>{

await fetch(
`https://website-for-villages-backend.onrender.com/admin/camp-request/${id}/reject`,
{
method:"PUT",
headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}
})

alert("Rejected")

}

return (
    <div className="admin-page">
      <h1>Camp Requests</h1>

      {requests.length === 0 && (
        <p className="empty-state">No camp requests found.</p>
      )}

      {requests.map(req => (
        <div key={req._id} className="request-card">

          <div className="request-info">
            <h3>{req.village?.name || "Unknown Village"}</h3>
            <div className="meta-row">
              <span className="meta-pill">👤 {req.villagehead?.username}</span>
              <span className={`status-badge ${req.status}`}>{req.status}</span>
            </div>
            <p>Camp: {req.title || "—"}</p>
          </div>

          <div className="request-actions">
            <button className="btn-approve" onClick={() => approve(req._id)}>
              Approve
            </button>
            <button className="btn-reject" onClick={() => reject(req._id)}>
              Reject
            </button>
          </div>

        </div>
      ))}
    </div>
  );

}