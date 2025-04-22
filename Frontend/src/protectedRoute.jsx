import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const type = user?.type;

  return token && type === "student" ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
