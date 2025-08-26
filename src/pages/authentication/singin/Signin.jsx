import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import HeroImage from "../../../assets/images/sign2.jpg";

const Signin = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5112/api/Auth/login", {
        Email: email,
        Password: password,
      });

      if (response.status === 200) {
        console.log(response.data.message);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      if (err.response?.status === 404) {
        setError("Login endpoint not found. Please check the server configuration.");
      } else if (err.response?.status === 401) {
        setError(err.response.data.message || "Invalid email or password.");
      } else {
        setError("An error occurred during sign-in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Google sign-in failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred during Google sign-in.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-row bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src={HeroImage} alt="Signin Illustration" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4zm-4 0c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4zm8 0c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Sign in to your account</h2>
          <p className="text-gray-400 mb-4 text-sm">
            Enter your email and password to sign in. Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 underline">Create an account</Link>
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center py-2 px-4 bg-white text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              "Signing In..."
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-3 text-gray-400 text-xs">OR CONTINUE WITH EMAIL</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-1 w-full px-3 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-3 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In with Email"}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-4 text-xs">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-400 underline">Terms of Service</a> and{" "}
            <a href="#" className="text-blue-400 underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;