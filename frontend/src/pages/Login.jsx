import { useState } from "react"
import { useNavigate,Link } from "react-router-dom"

export default function Login(){
const [contactno,setContactno]=useState("")
const [password,setPassword]=useState("")
const navigate = useNavigate()
const handleSubmit= async (e)=>{
e.preventDefault()
try{
const loginres = await fetch('https://website-for-villages-backend.onrender.com/auth/login',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({contactno,password})
}
)
const data = await loginres.json()
if(loginres.ok){
    localStorage.setItem('token',data.token);
    localStorage.setItem('userId',data.userId)
    localStorage.setItem("role",data.role)
    // alert("Login Successfully")
navigate(`/home/${data.userId}`)
}else{
alert("Invalid Login")
}
}
catch(err){
    console.log(err)
    alert("Error during Login")
}
}
return(
<>
<nav className="loginprocess">
Login Process
</nav>
<div className="formContainer2">
<form className="authForm" onSubmit={handleSubmit}>
Contact no<input
type="tel"
name="contactno"
placeholder="Contact Number"
maxLength={10}
minLength={10}
value={contactno}
autoComplete="username"
onChange={(e)=>setContactno(e.target.value)}
/>
Password<input
type="password"
name="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>
<button className="getstarted">
Login
</button>
<p style={{marginTop:"5px"}}>
Don't have an account? 
<Link to="/auth/signup"> Signup</Link>
</p>
</form>
</div>
</>
)
}