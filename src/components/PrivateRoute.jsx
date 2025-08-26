import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If no user exists, redirect to sign-in page
  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default PrivateRoute;
