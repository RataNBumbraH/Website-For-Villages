import { Navigate } from "react-router-dom"

export default function VillageHeadProtectedRoute({ children }) {

  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  const userId = localStorage.getItem("userId")

  // 1. Pehle check karo ki user logged-in hai ya nahi
  if (!token) {
    return <Navigate to="/auth/login" replace />
  }

  // 2. Phir check karo ki role "villagehead" hai ya nahi
  if (role !== "villagehead") {
    return <Navigate to={`/home/${userId}`} replace />
  }

  return children

}