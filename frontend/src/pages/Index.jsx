import { Link } from "react-router-dom"

export default function Index(){

return(

<div className="index-container">

<header className="hero">

<h1>Village Information Portal</h1>

<p>
Welcome to the Village Information Portal.  
This website provides detailed information about villages.
</p>

<div className="hero-buttons">

<Link to="/auth/login">
<button className="login-btn">Login</button>
</Link>

<Link to="/auth/signup">
<button className="signup-btn">Signup</button>
</Link>

</div>

</header>


<section className="features">

<h2>Website Features</h2>

<div className="feature-grid">

<div className="feature-card">
<h3>Village Details</h3>
<p>Explore complete information about villages.</p>
</div>

<div className="feature-card">
<h3>Population Data</h3>
<p>Check updated population records.</p>
</div>

<div className="feature-card">
<h3>Facilities</h3>
<p>Information about schools and hospitals.</p>
</div>

<div className="feature-card">
<h3>Development Info</h3>
<p>Learn about village development programs.</p>
</div>

</div>

</section>


<footer className="footer">

<p>© 2026 Village Information Portal</p>

</footer>

</div>

)

}