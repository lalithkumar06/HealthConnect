import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/error.css"; // Import CSS for styling

const ErrorPage = () => {
  const navigate = useNavigate();
  document.title = "HealthConnect | Error Page";
  return (
    <div className="error-container">
      <div className="error-card">
        <h1>Oops! Page Not Found</h1>
        <p>Looks like you are lost... Let's get you back home!</p>
        <img
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDlyY2RveHdjYW82cG94amlkaWppbGUyYmlkc2FmOWo0aWFma3B0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiN0L7EW5trfOvEk0/giphy.gif"
          alt="Error"
          className="error-gif"
        />
        <button onClick={() => navigate("/")} className="error-btn">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
