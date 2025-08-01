import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  // If no token exists, redirect to sign-in page
  if (!token) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default PrivateRoute;
