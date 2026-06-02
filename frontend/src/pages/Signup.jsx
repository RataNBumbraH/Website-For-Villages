import { useState } from "react";
import {useNavigate,Link} from "react-router-dom"

export default function Signup() {

const [username,setusername]=useState("")
const [contactno,setContactno]=useState("")
const [age,setAge]=useState("")
const [address,setAddress]=useState("")
const [qualification,setQualification]=useState("")
const [password,setPassword]=useState("")
const navigate = useNavigate();

const handleSubmit = async(e)=>{
e.preventDefault();
try{
    const signpress= await fetch('http://localhost:5000/auth/signup',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({username,contactno,age,address,qualification,password})
    })
    const data = await signpress.json()
    if(signpress.ok){
        // alert("Signup Successfully")
        navigate("/auth/login")
        console.log(data)
    }
    else{
        alert(data.message || 'Signup failed')
    }
}
catch(err){
console.log(err)
alert("Error during Signup")
} 
}
return(
<>
<nav className="loginprocess">
Signup Process
</nav>

<div className="formContainer">
<form className="authForm" onSubmit={handleSubmit}>
<input
type="text"
name="name"
value={username}
placeholder="Enter Name"
 onChange={(e)=>setusername(e.target.value)}
/>
<input
type="tel"
name="contactno"
value={contactno}
maxLength={10}
minLength={10}
placeholder="Contact Number"
autoComplete="username"
 onChange={(e)=>setContactno(e.target.value)}
/>
<input
type="number"
name="age"
value={age}
placeholder="Age"
onChange={(e)=>setAge(e.target.value)}
/>
<input
type="text"
name="address"
value={address}
placeholder="Address"
onChange={(e)=>setAddress(e.target.value)}
/>
<input
type="text"
name="qualification"
value={qualification}
placeholder="Qualification"
onChange={(e)=>setQualification(e.target.value)}
/>
<input
type="password"
name="password"
value={password}
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>
<button className="getstarted">
Signup
</button>
<p style={{marginTop:"2px"}}>
Already have an account? 
<Link to="/auth/login"> Login</Link>
</p>
</form>
</div>
</>
)
}