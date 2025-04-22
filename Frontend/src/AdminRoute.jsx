import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const type = user?.type;
  return token&&type ==='Admin' ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
