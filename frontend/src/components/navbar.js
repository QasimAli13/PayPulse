// components/navbar.jsx
import React from "react";
import { Landmark, LogOut } from "lucide-react";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Landmark size={28} strokeWidth={2} />
        <h2>PayPulse</h2>
      </div>

      <div className="nav-right">
        <span className="user-name">{user?.fullName}</span>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
