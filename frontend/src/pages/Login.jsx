import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function Login(){
  const [contactno, setContactno] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [requiresOtp, setRequiresOtp] = useState(false) // ✅ OTP screen toggle

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const bodyData = requiresOtp 
        ? { contactno, password, otp } 
        : { contactno, password };

      const loginres = await fetch('https://website-for-villages-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      })

      const data = await loginres.json()

      if(loginres.ok){
        if (data.requiresOtp) {
          setRequiresOtp(true);
          alert(data.message); // Server console te OTP show ho juga testing layi
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId)
          localStorage.setItem("role", data.role)
          navigate(`/home/${data.userId}`)
        }
      } else {
        alert(data.message || "Invalid Login")
      }
    } catch(err){
      console.log(err)
      alert("Error during Login")
    }
  }

  return(
    <>
      <nav className="loginprocess">
        Login Process {requiresOtp ? "- Enter OTP" : ""}
      </nav>
      <div className="formContainer2">
        <form className="authForm" onSubmit={handleSubmit}>
          
          {!requiresOtp ? (
            <>
              Contact no
              <input
                type="tel"
                name="contactno"
                placeholder="Contact Number"
                maxLength={10}
                minLength={10}
                value={contactno}
                autoComplete="username"
                onChange={(e) => setContactno(e.target.value)}
              />
              Password
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          ) : (
            <>
              Enter 6-digit OTP
              <input
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </>
          )}

          <button className="getstarted">
            {requiresOtp ? "Verify OTP & Login" : "Next (Send OTP)"}
          </button>

          {!requiresOtp && (
            <p style={{ marginTop: "5px" }}>
              Don't have an account? 
              <Link to="/auth/signup"> Signup</Link>
            </p>
          )}
        </form>
      </div>
    </>
  )
}