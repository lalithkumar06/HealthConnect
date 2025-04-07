import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import "../styles/hometop.css";
function HomeTop({ data }) {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    await localStorage.removeItem("token");
    await localStorage.removeItem("user");
    handleSuccess("Logout successful");
    setTimeout(()=>{
      navigate("/login");
    }, 500)
  };
  return (
    <div className="home-container">
      <div className="img-container">
        <div className="profile">
          <img
            src="/img/profile-icon.png"
            id="profile-icon"
            alt="profile-icon"
          />
          <p id="greet">Welcome {data ? data.user.name : "User"} !</p>
        </div>
        <button id="logoutbtn" onClick={handleLogOut}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default HomeTop;
