import React from "react";
import "./NavBar.css";
import Logo from "../src/assets/jobtracker-logo.jpg"; // Ensure correct path

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={Logo} alt="Job Tracker Logo" className="navbar-logo" />
        <span className="navbar-title">Job Tracker</span>
      </div>
      <div className="navbar-links">
        <button className="nav-button">Home</button>
        <button className="nav-button">Add Job</button>
        <button className="nav-button">AI Resume (coming soon)</button>
        <button className="nav-button">Settings (coming soon)</button>
        <button className="nav-button logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;