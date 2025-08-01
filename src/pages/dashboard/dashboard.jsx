import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [nextBackgroundIndex, setNextBackgroundIndex] = useState(1);
  const [fade, setFade] = useState(true); // Controls the fade effect
  const navigate = useNavigate();
  const location = useLocation();

  // Background images array
  const backgroundImages = [
    "/src/assets/images/dash1.jpg",
    "/src/assets/images/dash2.jpg",
  ];

  // Change background every 5 seconds with smooth crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out the current image
      setTimeout(() => {
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setNextBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setFade(true); // Fade in the new image
      }, 1000); // Match this with the transition duration
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    if (prompt) {
      navigate("/texture", { state: { prompt } });
    }
  };

  const isDashboardHome = location.pathname === "/dashboard";

  return (
    <div className="flex h-screen bg-black text-white font-poppins">
      {/* Sidebar */}
      <aside className="w-64 h-full flex flex-col justify-between border-r border-gray-800" style={{ backgroundColor: 'rgba(50, 50, 50, 0.7)' }}>
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tight uppercase mb-8">Tailor Tech</h1>
          <nav className="flex flex-col space-y-4">
            <a href="/dashboard" className="text-sm uppercase hover:text-cyan-400 transition-colors">Homepage</a>
            <a href="/about" className="text-sm uppercase hover:text-cyan-400 transition-colors">About</a>
            <a href="/gallery" className="text-sm uppercase hover:text-cyan-400 transition-colors">Digital Gallery</a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background Image Layers */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${backgroundImages[backgroundIndex]})`,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backgroundBlendMode: 'overlay',
            opacity: fade ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${backgroundImages[nextBackgroundIndex]})`,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backgroundBlendMode: 'overlay',
            opacity: fade ? 0 : 1,
          }}
        />

        {/* Content */}
        {isDashboardHome ? (
          <div className="flex flex-col items-center justify-center text-center space-y-8 relative z-10">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg animate-pulse">
              Design Your Perfect Outfit
            </h2>

            {/* Prompt Input and Button */}
            <div className="flex flex-col items-center space-y-4">
              <input
                type="text"
                placeholder="A red leather jacket, black"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-96 p-4 bg-gray-900 text-white border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                style={{
                  background: "linear-gradient(to right, #1a202c, #2d3748)",
                }}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt}
                className={`w-48 p-3 rounded-full font-semibold uppercase transition-all duration-300 transform hover:scale-105 shadow-xl ${
                  prompt
                    ? "bg-gradient-to-r from-cyan-400 to-pink-500 text-black hover:from-cyan-500 hover:to-pink-600"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Generate
              </button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <style>
        {`
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes blink-caret {
            from, to { border-color: transparent; }
            50% { border-color: #ccc; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          .animate-pulse {
            animation: pulse 2s infinite;
          }
          input::placeholder {
            animation: typing 3s steps(30, end) infinite, blink-caret 0.75s step-end infinite;
            white-space: nowrap;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;