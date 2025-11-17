import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  console.log('🔐 PrivateRoute check for path:', location.pathname);
  console.log('👤 User:', user?.email, 'Loading:', loading);

  // Show loading while checking authentication
  if (loading) {
    console.log('⏳ PrivateRoute: Still loading authentication...');
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If no user exists, redirect to sign-in page
  if (!user) {
    console.log('❌ PrivateRoute: No user found, redirecting to /signin');
    return <Navigate to="/signin" />;
  }

  console.log('✅ PrivateRoute: User authenticated, rendering protected content');
  console.log('🎯 About to render:', children?.type?.name || 'Unknown Component');
  return children;
};

export default PrivateRoute;
