import React from "react";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav>
      <div className="nav-links">
        <a href="/home" className="nav-item" data-label="Home">
          <i className="fas fa-home icon"></i>
          <span className="text">Home</span>
        </a>
        <a href="/bookslot" className="nav-item" data-label="Book a Slot">
          <i className="fas fa-calendar-check icon"></i>
          <span className="text">Book a Slot</span>
        </a>
        <a
          href="/available-medicines"
          className="nav-item"
          data-label="Available Medicines"
        >
          <i className="fas fa-pills icon"></i>
          <span className="text">Available Medicines</span>
        </a>
        <a
          href="/video-conference"
          className="nav-item"
          data-label="Video Conferencing"
        >
          <i className="fas fa-video icon"></i>
          <span className="text">Video Conferencing</span>
        </a>
        <a href="/contact-us" className="nav-item" data-label="Contact Us">
          <i className="fas fa-envelope icon"></i>
          <span className="text">Contact Us</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
