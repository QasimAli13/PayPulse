import React from "react";
import { Wallet } from "lucide-react";

function Navbar({ user, onLogout, activePage, setActivePage }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Wallet size={28} />
        <h2>PayPulse</h2>
      </div>


<div className="nav-links">

  <button
    className={
      activePage === "dashboard"
        ? "nav-link active"
        : "nav-link"
    }
    onClick={() => setActivePage("dashboard")}
  >
    Dashboard
  </button>

  <button
    className={
      activePage === "settings"
        ? "nav-link active"
        : "nav-link"
    }
    onClick={() => setActivePage("settings")}
  >
    Settings
  </button>

</div>


      <div className="nav-right">
        <span className="user-name">{user.fullName}</span>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
