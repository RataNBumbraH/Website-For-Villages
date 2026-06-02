import { Navigate } from "react-router-dom"

export default function VillageHeadProtectedRoute({children}) {

const token = localStorage.getItem("token")
const role = localStorage.getItem("role")
const userId = localStorage.getItem("userId")



if(role !== "villagehead"){
return <Navigate to={`/home/${userId}`} replace/>
}

if(!token){
return <Navigate to="/auth/login" replace/>
}

return children

}