import React from "react";
import "../styles/navbar.css";
const Navbar = () => {
  return (
    <nav>
      <a href="/home">Home</a>
      <a href="/bookslot"> Book a Slot</a>
      <a href="/available-medicines">Available Medicines</a>
      <a href="/video-conference">Video Conferencing</a>
      <a href="/contact-us">Contact us</a>
    </nav>
  );
};

export default Navbar;
