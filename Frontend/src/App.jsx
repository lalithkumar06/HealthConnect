import React, { useEffect } from "react";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Contact from './pages/Contact'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AvaiableMedicines from "./pages/AvaiableMedicines";
import BookSlot from "./pages/BookSlot"
import {jwtDecode} from "jwt-decode";
import ProtectedRoute from "./protectedRoute";
import ErrorPage from "./pages/ErrorPage";
import VideoConference from "./pages/VideoConference";
import api from "./api";
const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [data , setData ] = useState(null);
  useEffect(()=>{
    

    const gottoken = localStorage.getItem("token");
    const userdetails = localStorage.getItem("user");

    const isTokenValid = (token) => {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; 
        return decoded.exp > currentTime;
      } catch (error) {
        return false;
      }
    };

    if (gottoken && isTokenValid(gottoken)) {
      setToken(gottoken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }

    if (userdetails) {
      setUser(JSON.parse(userdetails));
    }

    const getData = async () => {
          try {
            const response = await api.get("/home");
            setData(response.data);
    
            
            
          } catch (error) {
            console.error("Error fetching dashboard:", error);
          }
        };
    
        if(userdetails){
          getData();
        }

  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home data = {data}/>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/contact-us" element = {<Contact data= {data}/>}/>
          <Route path="/available-medicines" element = {<AvaiableMedicines data={data}/>}/>
          <Route path="/bookslot" element ={<BookSlot data = {data}/>} />
          <Route path="/video-conference" element ={<VideoConference data = {data}/>} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
