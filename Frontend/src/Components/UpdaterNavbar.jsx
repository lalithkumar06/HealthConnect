import React from "react";
import "../styles/navbar.css";

const UpdaterNavbar = () => {
  return (
    <nav>
      <div className="nav-links">
        <a href="/updaterhome" className="nav-item" data-label="Home">
          <i className="fas fa-home icon"></i>
          <span className="text">Home</span>
        </a>
        
        <a
          href="/updateMedicines"
          className="nav-item"
          data-label="Update Medicines"
        >
          <i className="fas fa-pills icon"></i>
          <span className="text">Update Medicines</span>
        </a>
        
      </div>
    </nav>
  );
};

export default UpdaterNavbar;
