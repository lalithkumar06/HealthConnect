import React from "react";
import "../styles/navbar.css";

const AdminNavbar = () => {
  return (
    <nav>
      <div className="nav-links">
        <a href="/adminHome" className="nav-item" data-label="Home">
          <i className="fas fa-home icon"></i>
          <span className="text">Home</span>
        </a>

        <a
          href="/attend-conference"
          className="nav-item"
          data-label="Attend Conference"
        >
          <i className="fas fa-video icon"></i>
          <span className="text">Attend Conference</span>
        </a>
      </div>
    </nav>
  );
};

export default AdminNavbar;
