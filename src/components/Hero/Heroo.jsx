import { useState, useRef } from "react";
import image from "../../assets/images/front-imaged1.png"; // Ensure this points to your edited image

const Heroo = () => {
  const [activeSection, setActiveSection] = useState("blog");
  const sectionRefs = {
    blog: useRef(null),
    fashion: useRef(null),
    technology: useRef(null),
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    sectionRefs[section].current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-16 w-full">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Text Content */}
            <div className="md:w-1/2 text-center md:text-left md:-ml-8">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                <button
                  onClick={() => handleSectionClick("blog")}
                  className={`px-3 py-1 text-sm rounded-full cursor-pointer scroll-smooth ${
                    activeSection === "blog"
                      ? "bg-black text-white"
                      : "border border-gray-300"
                  }`}
                >
                  Blog
                </button>
                <button
                  onClick={() => handleSectionClick("fashion")}
                  className={`px-3 py-1 text-sm rounded-full cursor-pointer scroll-smooth ${
                    activeSection === "fashion"
                      ? "bg-black text-white"
                      : "border border-gray-300"
                  }`}
                >
                  Fashion
                </button>
                <button
                  onClick={() => handleSectionClick("technology")}
                  className={`px-3 py-1 text-sm rounded-full cursor-pointer scroll-smooth ${
                    activeSection === "technology"
                      ? "bg-black text-white"
                      : "border border-gray-300"
                  }`}
                >
                  Technology
                </button>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Virtual Try-on for Clothing: The Future of Fashion?
              </h2>
              <p className="mt-6 text-gray-700 text-base md:text-lg">
                Using virtual try-on technology, fashion brands can blend the
                physical and virtual to create an immersive customer experience,
                whether online or in-store.
              </p>
            </div>

            {/* Image Content */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative -ml-8 md:-ml-4 md:mr-8">
                <img
                  src={image}
                  alt="Clothing Example"
                  className="transition-all duration-500 hover:scale-105 hover:brightness-110 w-full md:w-[550px] md:h-[450px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div
            ref={sectionRefs.blog}
            className={`mb-12 opacity-0 translate-y-5 transition-all duration-500 ease-out ${
              activeSection === "blog" ? "opacity-100 translate-y-0" : ""
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">Blog</h3>
            <p className="text-gray-700">
              Tailor Tech's cutting-edge virtual try-on solution empowers users to design custom garments and visualize them on a digital mannequin. With intuitive tools, you can craft unique clothing, adjust fits, and see how fabrics drape and move. The platform simulates how garments look while walking, offering a realistic preview of style and motion. This innovative technology blends creativity and precision, transforming the way we shop and design fashion. Experience the future of personalized style with Tailor Tech’s immersive virtual fitting room.
            </p>
          </div>
          <div
            ref={sectionRefs.fashion}
            className={`mb-12 opacity-0 translate-y-5 transition-all duration-500 ease-out ${
              activeSection === "fashion" ? "opacity-100 translate-y-0" : ""
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">Fashion</h3>
            <p className="text-gray-700">
              Fashion is embracing digital transformation. From AI-driven design
              to augmented reality fitting rooms, the industry is creating
              personalized experiences that cater to modern consumers.
            </p>
          </div>
          <div
            ref={sectionRefs.technology}
            className={`opacity-0 translate-y-5 transition-all duration-500 ease-out ${
              activeSection === "technology" ? "opacity-100 translate-y-0" : ""
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">Technology</h3>
            <p className="text-gray-700">
              Cutting-edge technologies like AR, VR, and AI are powering the
              future of retail. Virtual try-on platforms leverage these tools to
              enhance customer satisfaction and reduce return rates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Heroo;