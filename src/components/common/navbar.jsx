import { useState, useEffect } from "react";
import { Menu, X, Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      title: "Solutions",
      subItems: [
        {
          name: "Enterprise Suite",
          href: "/solutions/enterprise",
          description: "Advanced AI tools for large businesses"
        },
        {
          name: "Small Business",
          href: "/solutions/small-business",
          description: "Affordable solutions for growing teams"
        },
      ],
    },
    {
      title: "Use Cases",
      subItems: [
        {
          name: "E-commerce",
          href: "/use-cases/ecommerce",
          description: "Boost online fashion sales"
        },
        {
          name: "Education",
          href: "/use-cases/education",
          description: "Learn fashion design with AI"
        },
      ],
    },
    {
      title: "Pricing",
      subItems: [
        {
          name: "Plans",
          href: "/pricing",
          description: "Choose the perfect plan"
        }
      ],
    },
    {
      title: "About",
      subItems: [
        {
          name: "Our Team",
          href: "/about/team",
          description: "Meet the minds behind TailorTech"
        }
      ],
    },
  ];

  const handleDropdownEnter = (index) => {
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100/50"
          : "bg-white/90 backdrop-blur-md"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Premium Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                    TailorTech
                  </h1>
                  <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                    AI Fashion Studio
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(index)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-all duration-300 rounded-lg hover:bg-gray-50 group">
                    <span className="relative">
                      {item.title}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
                    </span>
                    <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${activeDropdown === index ? "rotate-180" : ""
                      }`} />
                  </button>

                  {/* Premium Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden"
                      >
                        <div className="p-2">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.href}
                              className="flex items-start p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                    {subItem.name}
                                  </h4>
                                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                                <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600">
                                  {subItem.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Premium CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/signin">
                <button className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-all duration-300">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? "top-3 rotate-45" : "top-1"
                  }`} />
                <span className={`absolute block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? "opacity-0" : "top-3"
                  }`} />
                <span className={`absolute block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? "top-3 -rotate-45" : "top-5"
                  }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100/50"
            >
              <div className="px-4 py-6 space-y-4">
                {menuItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.title}
                    </h3>
                    <div className="pl-4 space-y-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.href}
                          className="block py-2 text-gray-600 hover:text-purple-600 transition-colors duration-300"
                          onClick={() => setIsOpen(false)}
                        >
                          <div>
                            <div className="font-medium">{subItem.name}</div>
                            <div className="text-sm text-gray-500">{subItem.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <Link to="/signin" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors duration-300 text-center">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;