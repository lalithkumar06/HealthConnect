import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const UpdaterRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const type = user?.type;
  return token&&type ==='User' ? <Outlet /> : <Navigate to="/login" />;
};

export default UpdaterRoute;
