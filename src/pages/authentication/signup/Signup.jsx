import { Link } from "react-router-dom";
import HeroImage from '../../../assets/images/sign2.jpg';
import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // Configure axios with proper CORS settings
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:5112/api/auth/signup',
        data: {
          Email: formData.email,
          Password: formData.password,
          Name: formData.email.split('@')[0] // Extract name from email as fallback
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false, // Try without credentials first
        timeout: 10000 // 10 second timeout
      });

      setMessage(response.data.message || "Account created successfully!");
      setFormData({ email: '', password: '', confirmPassword: '' }); // Clear form
      
    } catch (err) {
      console.error('Signup error:', err); // Debug logging
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else if (err.response) {
        // Server responded with error status
        const errorMsg = err.response.data?.message || 
                        (err.response.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : 
                        `Server error: ${err.response.status}`);
        setError(errorMsg);
      } else if (err.request) {
        // Request was made but no response received (likely CORS)
        setError('Unable to connect to server. Please check if the server is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-row bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src={HeroImage} alt="Signup Illustration" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-semibold text-white mb-2">Create an account</h2>
          <p className="text-gray-400 mb-4 text-sm">
            Enter your email and password to create an account. Already have an account?{" "}
            <Link to="/signin" className="text-blue-400 underline">Sign In</Link>
          </p>

          {message && <p className="text-green-400 text-sm">{message}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-white text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition duration-200 text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-3 text-gray-400 text-xs">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="flex justify-between gap-3">
            <button className="flex items-center justify-center w-1/2 py-2 px-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-200 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.153-1.11-1.46-1.11-1.46-.908-.62.069-.608.069-.608 1.004.07 1.532 1.033 1.532 1.033.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.203 2.393.1 2.646.64.698 1.028 1.591 1.028 2.682 0 3.842-2.337 4.687-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
            <button className="flex items-center justify-center w-1/2 py-2 px-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-200 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.992 22 12z" />
              </svg>
              Facebook
            </button>
          </div>

          <p className="text-gray-400 text-center mt-4 text-xs">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-400 underline">Terms of Service</a> and{" "}
            <a href="#" className="text-blue-400 underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;