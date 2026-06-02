import { useEffect, useState } from "react"

export default function AdminAllRequests(){

  const [requests,setRequests] = useState([])

  useEffect(()=>{

    fetch("http://localhost:5000/admin/all-camp-requests",{
      headers:{
        Authorization:"Bearer "+localStorage.getItem("token")
      }
    })
    .then(res=>res.json())
    .then(data=>setRequests(data))

  },[])

  return (
    <div className="admin-page">
      <h1>All Camp Requests</h1>

      {requests.map(req => (
        <div key={req._id} className="request-card">

          <h3>{req.village?.name}</h3>

          <p>👤 {req.villagehead?.username}</p>
          <p>📌 {req.title}</p>

          <p>Status:
            <b style={{
              color:
                req.status === "approved" ? "green" :
                req.status === "rejected" ? "red" : "orange"
            }}>
              {" "}{req.status}
            </b>
          </p>

          <p>Reply: {req.adminReply}</p>

        </div>
      ))}

    </div>
  )
}