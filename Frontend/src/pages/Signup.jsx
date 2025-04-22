import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
function Signup() {
    
    const [signupInfo , setSignupInfo]= useState({
        name : '', 
        email : '',
         password : '',
    })
    const navigate= useNavigate();
    const handlechange = (e) => {
      const { name, value } = e.target;
      setSignupInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

   const handlesubmit = async (e) => {
    setLoading(true);
     e.preventDefault();
     const { name, email, password } = signupInfo;

     if (!name || !email || !password) {
      setLoading(false);
       return handleError("All fields are required");
     }

     try {
       const url = "https://healthconnect-m7l6.onrender.com/auth/signup";
       const response = await fetch(url, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(signupInfo),
       });

       const result = await response.json();
       if (result.success) {
         handleSuccess(result.message);

         localStorage.setItem("token", result.jwttoken);
         localStorage.setItem(
           "user",
           JSON.stringify({ name: result.name, email: result.email })
         );

         setTimeout(() => {
           navigate("/home");
         }, 1000);
       } else {
         handleError(result.message);
       }
     } catch (err) {
       console.error("Signup Error:", err);
       handleError("Something went wrong!");
     }
     finally{
      setLoading(false);
     }
   };

   const [loading , setLoading] = useState(false);
  return (
    <div className="container">
      <div className="pic-container">
        <img id="login-bg"  src="/img/login-bg.jpg" alt="healthConnect" />
        <div className="loginForm">
          <h1>Signup</h1>
          <form>
            <div className="input-field">
              <label htmlFor="name">Name : </label>
              <input
                type="text"
                name="name"
                placeholder="name"
                autoFocus
                onChange={(e) => handlechange(e)}
                value={signupInfo.name}
              />
            </div>
            <div className="input-field">
              <label htmlFor="email">Email : </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                onChange={(e) => handlechange(e)}
                value={signupInfo.email}
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password : </label>
              <input
                type="password"
                name="password"
                placeholder="password"
                onChange={(e) => handlechange(e)}
                value={signupInfo.password}
              />
            </div>
            <button id= "btn" type="submit" onClick={(e) => handlesubmit(e)}>
              {!loading ? "Signup" : <div className='loader'></div>}
            </button>
            <p id="signup-container">
              Already have an account ? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
