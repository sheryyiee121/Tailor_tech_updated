import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Palette, Camera, Zap, ArrowRight, Shirt, Users, Star } from "lucide-react";
import promptStorageService from "../../services/promptStorageService";

const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile on component mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGenerate = async () => {
    if (prompt) {
      setIsGenerating(true);

      // 🚀 SAVE PROMPT AT RUNTIME
      promptStorageService.savePrompt(prompt);
      console.log(`💾 Runtime Command Saved: "${prompt}"`);

      // Simulate generation time
      setTimeout(() => {
        setIsGenerating(false);
        navigate("/texture", { state: { prompt } });
      }, 2000);
    }
  };

  const isDashboardHome = location.pathname === "/dashboard";

  const quickPrompts = [
    "Red leather jacket with black details",
    "Elegant evening gown with sequins",
    "Casual denim jacket with patches",
    "Formal business suit with tie",
    "Summer dress with floral pattern",
    "Winter coat with fur collar"
  ];

  // Mobile: show only 2 prompts, Desktop: show all 6
  const displayPrompts = isMobile ? quickPrompts.slice(0, 2) : quickPrompts;

  const features = [
    { icon: Shirt, title: "3D Try-On", desc: "Virtual fitting experience" },
    { icon: Palette, title: "AI Design", desc: "Smart style generation" },
    { icon: Camera, title: "Photo Realistic", desc: "High-quality renders" },
    { icon: Zap, title: "Instant Results", desc: "Quick generation" }
  ];

  return (
    <div className="dashboard-page">
      <div className="flex flex-col lg:flex-row h-screen bg-black text-white font-poppins overflow-hidden" style={{ margin: 0, padding: 0, maxWidth: 'none', textAlign: 'left' }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 text-white rounded-lg border border-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Premium Black Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`w-full lg:w-80 xl:w-96 h-auto lg:h-full flex flex-col justify-between border-r-0 lg:border-r border-b lg:border-b-0 border-gray-800 bg-black flex-shrink-0 z-50 ${isMobile ? (sidebarOpen ? 'fixed top-0 left-0 h-screen' : 'hidden') : ''
            }`}
        >
          <div className="p-4 lg:p-6">
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Premium Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 lg:mb-8"
            >
              <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 lg:w-6 lg:h-6 text-black" />
                </div>
                <h1 className="text-lg lg:text-2xl font-extrabold tracking-tight text-white">
                  TAILOR TECH
                </h1>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">AI-Powered Fashion Studio</p>
            </motion.div>

            {/* Navigation */}
            <nav className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-3">
              {[
                { href: "/dashboard", label: "Homepage", icon: Star },
                { href: "/about", label: "About", icon: Users },
                { href: "/gallery", label: "Gallery", icon: Camera }
              ].map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm uppercase hover:bg-white hover:text-black transition-all duration-300 rounded-xl group flex-1 lg:flex-none justify-center lg:justify-start"
                >
                  <item.icon className="w-3 h-3 lg:w-4 lg:h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium hidden sm:block lg:block">{item.label}</span>
                </motion.a>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="p-4 lg:p-6 border-t border-gray-800">
            <UserProfile />
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex items-start lg:items-center justify-center relative overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-black min-h-0">
          {/* Content */}
          {isDashboardHome ? (
            <div className="flex flex-col items-center justify-start lg:justify-center text-center space-y-4 lg:space-y-8 relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8 w-full min-h-screen lg:min-h-0">
              {/* Premium Title */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-3 lg:space-y-6"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider lg:tracking-widest text-white drop-shadow-2xl leading-tight px-2">
                  Design Your Perfect Outfit
                </h2>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed font-light px-2">
                  Experience the future of fashion with AI-powered 3D clothing visualization and virtual try-on technology
                </p>
              </motion.div>

              {/* Input Section */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="w-full max-w-4xl space-y-3 lg:space-y-5"
              >
                {/* Quick Prompts */}
                <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                  {displayPrompts.map((promptText, index) => (
                    <motion.button
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      onClick={() => {
                        setPrompt(promptText);
                        promptStorageService.savePrompt(promptText);
                        console.log(`💾 Quick Prompt Saved: "${promptText}"`);
                      }}
                      className="px-3 py-2 lg:px-4 lg:py-2 bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap"
                    >
                      {promptText}
                    </motion.button>
                  ))}
                </div>

                {/* Main Input */}
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Describe your dream outfit... (e.g., A red leather jacket with black details)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 lg:p-6 bg-white text-black border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white text-base lg:text-lg font-medium placeholder:text-gray-500 transition-all duration-300 shadow-2xl"
                  />
                  <div className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                  </div>
                </div>

                {/* Premium Generate Button */}
                <motion.button
                  onClick={handleGenerate}
                  disabled={!prompt || isGenerating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative group px-8 lg:px-12 py-3 lg:py-4 rounded-2xl font-bold uppercase text-base lg:text-lg transition-all duration-500 transform shadow-2xl w-full sm:w-auto ${prompt && !isGenerating
                    ? "bg-white text-black hover:bg-gray-100 hover:shadow-white/25"
                    : "bg-gray-800 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <span>Generate Outfit</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </motion.button>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full max-w-6xl"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    className="flex flex-col items-center text-center p-3 lg:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl lg:rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 lg:w-8 lg:h-8 text-black" />
                    </div>
                    <h3 className="font-semibold text-white mb-1 lg:mb-2 text-sm lg:text-lg">{feature.title}</h3>
                    <p className="text-xs lg:text-sm text-gray-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>

        {/* Responsive Design */}
        <style jsx>{`
        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid #374151;
          }
          
          .main-content {
            padding: 1rem;
          }
          
          .title {
            font-size: 2.5rem;
            line-height: 1.2;
          }
          
          .input-field {
            padding: 1rem;
            font-size: 1rem;
          }
          
          .generate-button {
            padding: 1rem 2rem;
            font-size: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .title {
            font-size: 2rem;
          }
          
          .quick-prompts {
            flex-direction: column;
            align-items: center;
          }
          
          .quick-prompts button {
            width: 100%;
            max-width: 300px;
          }
        }
        
        /* Ensure proper text rendering at all zoom levels */
        * {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Fix zoom issues */
        html {
          zoom: 1;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        
        /* Ensure content fits properly */
        .dashboard-container {
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        /* Additional responsive fixes */
        @media (max-width: 1024px) {
          .sidebar {
            width: 280px;
          }
          
          .main-content {
            padding: 2rem 1rem;
          }
        }
        
        @media (max-width: 640px) {
          .sidebar {
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 50;
            height: auto;
            min-height: 200px;
          }
          
          .main-content {
            margin-top: 200px;
            padding: 1rem;
          }
          
          .title {
            font-size: 2rem;
            line-height: 1.1;
          }
          
          .description {
            font-size: 1rem;
            line-height: 1.5;
          }
        }
        
        /* High DPI and zoom support */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
        
        /* Ensure buttons are properly sized */
        button {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Fix input sizing issues */
        input, textarea {
          box-sizing: border-box;
          max-width: 100%;
        }
            `}</style>
      </div>
    </div>
  );
};

export default Dashboard;