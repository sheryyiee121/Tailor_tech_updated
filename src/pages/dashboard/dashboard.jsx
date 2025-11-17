import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Menu,
  Home,
  Info,
  Images,
  Shield
} from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";
import { isAdmin } from "../../config/adminConfig";

const Dashboard = () => {
  const [prompt, setPrompt] = useState("");

  console.log('🎨 Dashboard component rendered! Current prompt:', prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentPanelOpen, setRecentPanelOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const userIsAdmin = user && isAdmin(user.email);

  // Check if mobile on component mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debug navigation changes
  useEffect(() => {
    console.log('🔍 NAVIGATION CHANGED!');
    console.log('📍 New pathname:', location.pathname);
    console.log('📦 Location state:', location.state);
    console.log('🔎 Full location object:', location);
  }, [location]);

  const isDashboardHome = location.pathname === "/dashboard";

  console.log('🔍 Current pathname:', location.pathname);
  console.log('🏠 Is Dashboard Home?', isDashboardHome);

  // Dashboard home load effect
  useEffect(() => {
    if (!user || !isDashboardHome) return;
    console.log('🏠 Dashboard home loaded for:', user.email);
  }, [user, isDashboardHome]);

  const handleGenerate = () => {
    console.log('🎯 handleGenerate called! Prompt:', prompt);

    if (!prompt || prompt.trim() === "") {
      console.log('❌ No prompt entered');
      return;
    }

    console.log('✅ Prompt exists, starting generation...');

    // Save prompt to sessionStorage only
    sessionStorage.setItem('currentPrompt', prompt);
    console.log(`💾 Prompt saved: "${prompt}"`);

    // Set generating state for the loading animation
    setIsGenerating(true);

    // Navigate after delay for loading effect
    setTimeout(() => {
      console.log('⏰ Timer complete! Navigating now...');
      setIsGenerating(false);

      // Navigate with state
      console.log('🚀 Navigating to /texture...');
      navigate('/texture', {
        state: { prompt: prompt }
      });
    }, 2000);
  };

  // Only 3 quick prompts as requested
  const quickPrompts = [
    "Elegant black evening dress",
    "Modern streetwear outfit",
    "Classic business suit"
  ];

  // Get recent creations from storage (disabled - no backend)
  const recentCreations = [];

  return (
    <div className="dashboard-page">
      <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-poppins overflow-hidden">

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Minimal Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`${isMobile ? (sidebarOpen ? 'fixed inset-y-0 left-0 z-40' : 'hidden') : 'relative'
            } w-72 bg-black/50 backdrop-blur-xl border-r border-white/10`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Logo */}
            <div className="p-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">TAILOR TECH</h1>
                  <p className="text-xs text-gray-400">AI Fashion Studio</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">
              {[
                { href: "/dashboard", label: "Home", icon: Home },
                { href: "/about", label: "About", icon: Info },
                { href: "/gallery", label: "Gallery", icon: Images },
                ...(userIsAdmin ? [{ href: "/admin", label: "Admin Panel", icon: Shield }] : [])
              ].map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  <span className="text-gray-300 group-hover:text-white">{item.label}</span>
                </motion.a>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-6 border-t border-white/10">
              <UserProfile />
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">
          {isDashboardHome ? (
            <div className="h-full flex items-center justify-center p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-3xl"
              >
                {/* Main Input Section */}
                <div className="text-center space-y-8">
                  {/* Title - Simple and Clean */}
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                  >
                    Design Your Outfit
                  </motion.h1>

                  {/* Input with integrated button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative max-w-2xl mx-auto"
                  >
                    <input
                      type="text"
                      placeholder="Describe your dream outfit..."
                      value={prompt}
                      onFocus={(e) => console.log('🎯 Input FOCUSED!')}
                      onBlur={(e) => console.log('💨 Input BLURRED!')}
                      onChange={(e) => {
                        console.log('📝 Input changed! New value:', e.target.value);
                        setPrompt(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        console.log('⌨️ Key pressed:', e.key, 'Current prompt:', prompt);
                        if (e.key === 'Enter') {
                          console.log('⏎ ENTER KEY PRESSED! Calling handleGenerate...');
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                      className="w-full px-6 py-5 pr-16 bg-white/10 border border-white/20 rounded-2xl text-lg placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all"
                    />
                    <button
                      onClick={() => {
                        console.log('🖱️ BUTTON CLICKED! Prompt value:', prompt);
                        handleGenerate();
                      }}
                      disabled={!prompt || isGenerating}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${isGenerating
                        ? 'bg-gray-800 text-gray-400 cursor-wait opacity-80'
                        : prompt
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {isGenerating ? (
                        <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-6 h-6" />
                      )}
                    </button>
                  </motion.div>

                  {/* 3 Quick Prompts Only */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3"
                  >
                    {quickPrompts.map((promptText, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        onClick={() => setPrompt(promptText)}
                        className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm hover:bg-white/10 hover:border-white/20 transition-all"
                      >
                        {promptText}
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>

        {/* Recent Creations Panel - Collapsible from Right */}
        <AnimatePresence>
          {isDashboardHome && (
            <>
              {/* Toggle Button */}
              <motion.button
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ delay: 1 }}
                onClick={() => setRecentPanelOpen(!recentPanelOpen)}
                className="fixed right-0 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md p-3 rounded-l-xl border border-r-0 border-white/10 z-30"
              >
                <div className="flex items-center gap-2">
                  {recentPanelOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  <Clock className="w-5 h-5" />
                </div>
              </motion.button>

              {/* Recent Panel */}
              <motion.div
                initial={{ x: 400 }}
                animate={{ x: recentPanelOpen ? 0 : 400 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed right-0 top-0 h-full w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 z-20 overflow-hidden"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      Recent Creations
                    </h3>
                    <button
                      onClick={() => setRecentPanelOpen(false)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3">
                    {recentCreations.length > 0 ? (
                      recentCreations.map((creation) => (
                        <motion.div
                          key={creation.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: creation.id * 0.05 }}
                          className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                          onClick={() => {
                            setPrompt(creation.prompt);
                            setRecentPanelOpen(false);
                          }}
                        >
                          <div className="flex gap-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate group-hover:text-clip group-hover:whitespace-normal">
                                {creation.prompt}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{creation.date}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 mt-8">No recent creations yet</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;