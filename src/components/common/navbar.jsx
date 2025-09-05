import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: "Solutions",
      subItems: [
        { name: "Enterprise Suite", href: "/solutions/enterprise" },
        { name: "Small Business", href: "/solutions/small-business" },
      ],
    },
    {
      title: "Use Cases",
      subItems: [
        { name: "E-commerce", href: "/use-cases/ecommerce" },
        { name: "Education", href: "/use-cases/education" },
      ],
    },
    {
      title: "Pricing",
      subItems: [{ name: "Plans", href: "/pricing" }],
    },

    {
      title: "About",
      subItems: [{ name: "Our Team", href: "/about/team" }],
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo - Leftmost Corner */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-semibold text-gray-900 transition-all duration-300 ease-in-out hover:text-gray-700 cursor-pointer">
                Tailor Tech
              </h1>
            </Link>
          </div>

          {/* Center Menu for Desktop */}
          <div className="hidden lg:flex flex-grow justify-center">
            <div className="flex space-x-10">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group">
                  <a
                    href="#"
                    className="text-gray-600 text-sm font-medium uppercase tracking-wide hover:text-gray-900 transition-all duration-300 ease-in-out flex items-center"
                  >
                    {item.title}
                    <span className="ml-1 transition-transform duration-300 ease-in-out group-hover:-rotate-180">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </a>
                  <div className="absolute top-full left-0 w-48 pt-3 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-in-out transform -translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white rounded-md shadow-lg border border-gray-100 py-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 ease-in-out"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Let's Talk Button - Rightmost Corner */}
          <div className="hidden lg:block flex-shrink-0">
            <Link to={'/signup'} >
              <button className="bg-gray-700 text-white px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wide transition-all duration-300 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-900 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={24} className="transition-all duration-300 rotate-90" />
            ) : (
              <Menu size={24} className="transition-all duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-white px-4 sm:px-6 py-6 space-y-6 border-t border-gray-100">
            {menuItems.map((item, index) => (
              <div key={index} className="w-full">
                <a
                  href="#"
                  className="block text-gray-900 font-medium text-base hover:text-gray-700 transition-all duration-300 py-2"
                >
                  {item.title}
                </a>
                <div className="ml-4 space-y-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.href}
                      className="block text-gray-600 hover:text-gray-900 transition-all duration-200 text-sm py-1.5"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <button className="w-full bg-gray-700 text-white px-6 py-3 rounded-full font-medium uppercase tracking-wide transition-all duration-300 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Get Started
            </button>
          </div>
        </div>
      </nav>
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;
