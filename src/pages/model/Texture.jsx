import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Placeholder background image (replace with your chosen image)
import backgroundImage from "../../assets/images/textback.jpg"; // Add your background image here

// Placeholder model ramp images (replace with your sourced images)
import image1 from "../../assets/images/cube.png"; // Cone-shaped ramp image 1
import image2 from "../../assets/images/cube.png"; // Cone-shaped ramp image 2
import image3 from "../../assets/images/cube.png"; // Cone-shaped ramp image 3

const Texture = ({ onTextureSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image directly
  const navigate = useNavigate();
  const location = useLocation();
  const { prompt } = location.state || {};

  // Array of images (no names or IDs needed)
  const images = [image1, image2, image3];

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleNext = () => {
    if (selectedImage) {
      if (onTextureSelect) {
        onTextureSelect(selectedImage); // Pass the selected image to the parent if needed
      }
      navigate("/model", { state: { prompt, texture: selectedImage } });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white font-poppins bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Apply background image
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50" /> {/* Semi-transparent overlay */}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h2 className="text-5xl font-extrabold mb-24 text-white drop-shadow-lg">
          SELECT THE TEXTURE
        </h2>
        <div className="flex space-x-12">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(image)}
              className="cursor-pointer transform transition-all duration-300 hover:scale-110"
            >
              <img
                src={image}
                alt={`Texture ${index + 1}`}
                className="w-40 h-60 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={!selectedImage}
          className={`mt-12 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
            selectedImage
              ? "bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-lg"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Texture;