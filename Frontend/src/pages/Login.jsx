import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "../styles/login.css";
import { useLocation } from "react-router-dom";
function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const type = user?.type;
    if (token) {
      if (type === "student") {
        navigate("/home");
      } else if (type === "Admin") {
        navigate("/adminHome");
      } else if (type === "User") {
        navigate("/updaterHome");
      }
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = loginInfo;

    if (!email || !password) {
      setLoading(false);
      return handleError("All fields are required");
    }

    try {
      const url = "http://localhost:5028/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);

        localStorage.setItem("token", result.jwttoken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: result.name,
            email: result.email,
            type: result.type,
          })
        );
        const type = result.type;
        console.log("type : ", type);
        setTimeout(() => {
          if (type === "student") {
            console.log("reached student");
            navigate("/home");
          } else if (type === "Admin") {
            navigate("/adminHome");
          } else if (type === "User") {
            navigate("/updaterHome");
          }
        }, 1000);
      } else {
        handleError(result.message);
      }
      setLoading(false);
    } catch (err) {
      console.error("Login Error:", err);
      handleError("Something went wrong!");
      setLoading(false);
    }
  };
  document.title = "HealthConnect | Login";
  return (
    <div className="container">
      <div className="pic-container">
        <img id="login-bg" src="/img/login-bg.jpg" alt="healthConnect" />
        <div className="loginForm">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="email">Email </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
                value={loginInfo.email}
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                onChange={handleChange}
                value={loginInfo.password}
              />
            </div>
            <button id="btn" type="submit">
              {!loading ? "Login" : <div className="loader"></div>}
            </button>
            <p id="signup-container">
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
