import React from "react";
import { motion } from "framer-motion";
import fashionImg1 from "../../assets/images/techno-image2.jpg";

const Fashion = () => {
  return (
    <section
      id="fashion"
      className="relative min-h-screen bg-gray-100 text-white py-20 overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url(${fashionImg1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
      <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
        <motion.h2
          className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-2xl uppercase"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
            transition: { duration: 0.3 },
          }}
        >
          Fashion & Style
        </motion.h2>
        <motion.p
          className="mt-6 text-xl md:text-2xl font-medium opacity-80 hover:opacity-100"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileHover={{
            scale: 1.1,
            textShadow: "0 0 15px rgba(255, 255, 255, 0.6)",
            transition: { duration: 0.3 },
          }}
        >
          Discover the Latest Trends
        </motion.p>
      </div>
    </section>
  );
};

export default Fashion;
