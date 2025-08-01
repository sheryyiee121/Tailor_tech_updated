import React from "react";
import { motion } from "framer-motion";
import techImg2 from "../../assets/images/techno-image.jpg";

const TechnologySection = () => {
  return (
    <section
      id="technology"
      className="relative min-h-screen bg-gray-900 text-white py-20 overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url(${techImg2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-gray-900/60"></div>
      <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
        <motion.h2
          className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-2xl uppercase"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 20px rgba(0, 255, 255, 0.8)",
            transition: { duration: 0.3 },
          }}
        >
          Technology in Fashion
        </motion.h2>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-medium opacity-80 hover:opacity-100"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileHover={{
            scale: 1.1,
            textShadow: "0 0 15px rgba(0, 255, 255, 0.6)",
            transition: { duration: 0.3 },
          }}
        >
          Innovate Your Wardrobe
        </motion.p>
      </div>
    </section>
  );
};

export default TechnologySection;
