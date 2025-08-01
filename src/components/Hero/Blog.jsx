import React from "react";
import { motion } from "framer-motion";

import image from "../../assets/images/bunting-kargbo-QscxOdWRkU0-unsplash.jpg";
import image2 from "../../assets/images/camila-blando-8rt6kbL4tKk-unsplash.jpg";
import image3 from "../../assets/images/technology-female-image.jpg";

const blogs = [
  {
    id: "blog",
    category: "Blog",
    image: image,
    subtitle: "Stories & Insights",
  },
  {
    id: "fashion",
    category: "Fashion",
    image: image2,
    subtitle: "Trends & Styles",
  },
  {
    id: "technology",
    category: "Technology",
    image: image3,
    subtitle: "Innovation Hub",
  },
];

const BlogSection = () => {
  return (
    <section className="min-h-screen bg-white text-black py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-5xl md:text-7xl font-extrabold text-center mb-20 tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-400 drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Explore Topics
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              id={blog.id}
              className="relative h-[80vh] rounded-3xl overflow-hidden shadow-xl group cursor-pointer perspective-1000"
              initial={{ opacity: 0, rotateY: 30, y: 50 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.4 },
              }}
            >
              {/* Background Image with Light Grey Tint */}
              <img
                src={blog.image}
                alt={blog.category}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-115 brightness-75"
              />
              {/* Light Grey Overlay */}
              <div className="absolute inset-0 bg-gray-300/30 mix-blend-overlay"></div>

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:bg-black/70">
                <motion.h3
                  className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white drop-shadow-md"
                  initial={{ y: 20, opacity: 0.8 }}
                  whileHover={{
                    y: 0,
                    opacity: 1,
                    textShadow: "0 0 20px rgba(255, 255, 255, 0.9)",
                    transition: { duration: 0.3 },
                  }}
                >
                  {blog.category}
                </motion.h3>
                <motion.p
                  className="mt-4 text-lg md:text-xl font-medium text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ y: 30 }}
                  whileHover={{ y: 0, transition: { duration: 0.3 } }}
                >
                  {blog.subtitle}
                </motion.p>
              </div>

              {/* Creative Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent rounded-3xl group-hover:border-white/30 transition-all duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
