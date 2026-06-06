// import React from "react";
// import { Link ,useNavigate} from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("role")
//   function handleLogout() {
//     const confirmLogout = window.confirm("Are you sure you want to Logout");
//     if (confirmLogout) {
//       localStorage.clear();
//       navigate("/auth/login");
//     }
//   }
//   return (
//     <header className="navbar">

//       <div className="logo">
//          Villages Information Portal
//       </div>
//       <div>

//       {role === "admin" && (
//         <button className="panel-btn"
//           onClick={() => navigate("/admin")}
//         >
//           Go to Admin Panel
//         </button>
//       )}

//       {role === "villagehead" && (
//         <button className="panel-btn"
//           onClick={() => navigate("/villagehead")}
//         >
//           Go to VillageHead Panel
//         </button>
//       )}

//     </div>
//       <nav className="nav-links">
//         <Link to="/villages">Villages</Link>
//         {/* <Link to="/about">About</Link>
//         <Link to="/contact">Contact</Link>   */}
//         <button onClick={handleLogout}>
//           Logout
//         </button>
//       </nav>

//     </header>
//   );
// }

// export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  function handleLogout() {
    const confirmLogout = window.confirm("Are you sure you want to Logout?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/auth/login");
    }
  }

  return (
    <header className="navbar">
      {/* 1. Logo Section */}
      <div className="logo">
        Villages Information Portal
      </div>

      {/* 2. Controls & Navigation Links Block */}
      <nav className="nav-links">
        {/* Role based buttons ab seedha nav-links ke andar hain taaki desktop par row aur mobile par stack ban sakein */}
        {role === "admin" && (
          <button 
            className="panel-btn"
            onClick={() => navigate("/admin")}
          >
            Go to Admin Panel
          </button>
        )}

        {role === "villagehead" && (
          <button 
            className="panel-btn"
            onClick={() => navigate("/villagehead")}
          >
            Go to VillageHead Panel
          </button>
        )}

        <Link to="/villages">Villages</Link>
        
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;