
import { motion } from "framer-motion";

const Footer = () => {
  // Animation variants for staggered effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-black text-white py-16 relative overflow-hidden w-full">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100%" height="100%" fill="url(#grainy)" />
          <defs>
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <pattern
              id="grainy"
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
            >
              <rect
                width="100"
                height="100"
                filter="url(#noiseFilter)"
                fill="gray"
              />
            </pattern>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-10 leading-tight"
          variants={itemVariants}
        >
          Drop us a line or two, we’re open to creative minds and
          collaborations!
        </motion.h2>
        <motion.button
          className="bg-white text-black px-10 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Tailor Tech</span>
          <span className="absolute inset-0 bg-gray-200 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
        </motion.button>
      </motion.div>

      {/* Footer Navigation */}
      <div className="mt-16 max-w-7xl mx-auto px-6 border-t border-gray-700 pt-8">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Logo/Brand */}
          <motion.div
            variants={itemVariants}
            className="text-lg font-bold text-white"
          >
            Tailor Tech
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8 text-sm font-medium text-gray-400"
            variants={containerVariants}
          >
            {["About", "Features", "Works", "Support"].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="hover:text-white transition-colors duration-200 relative group"
                variants={itemVariants}
              >
                {link}
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </motion.div>

          {/* Social Media Icons */}
          <motion.div className="flex gap-6" variants={containerVariants}>
            {[
              {
                name: "Twitter",
                path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178-.004-.355-.012-.532A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
              },
              {
                name: "Facebook",
                path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
              },
              {
                name: "Instagram",
                path: "M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.338 3.608 1.313C21.477 3.993 22.062 5.26 22.13 6.626c.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.338 2.633-1.313 3.608-1.313 1.313-2.61 1.588-3.608 1.625-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.338-3.608-1.313C3.993 16.477 3.408 15.21 3.34 13.844c-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.338-2.633 1.313-3.608C4.523 2.477 5.79 2.892 7.156 2.824c1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.332.014 7.052.072 5.775.13 4.841.4 3.807 1.434 2.773 2.468 2.502 3.402 2.444 4.648c-.057 1.28-.072 1.689-.072 5.012s.015 3.732.072 5.012c.058 1.246.329 2.18 1.363 3.214 1.034 1.034 1.968 1.305 3.214 1.363 1.28.057 1.689.072 5.012.072s3.732-.015 5.012-.072c1.246-.058 2.18-.329 3.214-1.363 1.034-1.034 1.305-1.968 1.363-3.214.057-1.28.072-1.689.072-5.012s-.015-3.732-.072-5.012c-.058-1.246-.329-2.18-1.363-3.214-1.034-1.034-1.968-1.305-3.214-1.363C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z",
              },
              {
                name: "GitHub",
                path: "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.218.682-.485 0-.237-.008-.866-.013-1.7-2.782.602-3.369-1.34-3.369-1.34-.456-1.156-1.113-1.464-1.113-1.464-.912-.623.069-.611.069-.611 1.006.07 1.536 1.035 1.536 1.035.893 1.532 2.341 1.089 2.91.832.091-.647.35-1.09.636-1.34-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.268.098-2.638 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.545 1.37.202 2.385.1 2.638.64.698 1.028 1.591 1.028 2.682 0 3.84-2.337 4.687-4.562 4.933.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.577.688.479C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z",
              },
            ].map((icon) => (
              <motion.a
                key={icon.name}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.2 }}
              >
                <span className="sr-only">{icon.name}</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule={
                      icon.name === "Instagram" || icon.name === "GitHub"
                        ? "evenodd"
                        : "none"
                    }
                    d={icon.path}
                    clipRule={
                      icon.name === "Instagram" || icon.name === "GitHub"
                        ? "evenodd"
                        : "none"
                    }
                  />
                </svg>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-8 text-center text-sm text-gray-500"
          variants={itemVariants}
        >
          &copy; {new Date().getFullYear()} Tailor Tech. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
