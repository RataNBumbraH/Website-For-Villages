import { Navigate } from "react-router-dom"

export default function AdminProtectedRoute({children}){

const token = localStorage.getItem("token")
const role = localStorage.getItem("role")
const userId = localStorage.getItem("userId")

if(!token){
return <Navigate to="/auth/login" replace/>
}

if(role !== "admin"){
return <Navigate to={`/home/${userId}`} replace/>
}

return children

}