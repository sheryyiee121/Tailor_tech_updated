import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import backgroundImage from "../../assets/images/textback.jpg"; // Import the background image
import maleSmall from "../../assets/images/male-small.png";
import maleMedium from "../../assets/images/male-Medium.png";
import maleLarge from "../../assets/images/male-large.png";
import femaleSmall from "../../assets/images/Female-small.png";
import femaleMedium from "../../assets/images/Female-medium.png";
import femaleLarge from "../../assets/images/Female-large.png";

const Model = ({ selectedTexture }) => {
  const [gender, setGender] = useState("");
  const [mannequinSize, setMannequinSize] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleNext = () => {
    if (gender && mannequinSize) {
      // Navigate to the animation page with selected data
      navigate("/animation", {
        state: { gender, mannequinSize, texture: selectedTexture },
      });
    }
  };

  // Mannequin images imported from the images folder
  const mannequins = {
    male: {
      small: maleSmall,
      medium: maleMedium,
      large: maleLarge,
    },
    female: {
      small: femaleSmall,
      medium: femaleMedium,
      large: femaleLarge,
    },
  };

  // Mannequin size options for image display
  const sizes = ["small", "medium", "large"];

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-black font-poppins"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h2 className="text-4xl font-bold mb-8 text-white">Select Mannequin</h2>
      <div className="flex flex-col items-center space-y-8">
        {/* Display selected texture */}
        {selectedTexture && (
          <div className="mb-6">
            <p className="text-lg text-white">Selected Texture: {selectedTexture.name}</p>
          </div>
        )}

        {/* Gender Selection */}
        <select
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            setMannequinSize(""); // Reset size when gender changes
          }}
          className="w-80 p-4 bg-gray-200 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-300 transition-all duration-300 text-xl"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Mannequin Size Selection with Images */}
        {gender && (
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => {
                  setMannequinSize(size);
                }}
                className={`cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 hover:brightness-110 rounded-lg overflow-hidden ${
                  mannequinSize === size ? "ring-4 ring-black" : ""
                }`}
              >
                <img
                  src={mannequins[gender][size]}
                  alt={`${gender}-${size}`}
                  className="w-48 h-64 object-contain opacity-0 transition-opacity duration-500"
                  onLoad={(e) => (e.target.style.opacity = "1")} // Smooth fade-in on load
                />
                <p className="text-center text-white mt-2 capitalize">{size}</p>
              </div>
            ))}
          </div>
        )}

        {/* Prompt to select an image */}
        {gender && !mannequinSize && (
          <p className="text-white mt-4">Click an image to select a mannequin size</p>
        )}

        {/* Next Button */}
        {gender && mannequinSize && (
          <button
            onClick={handleNext}
            className="mt-8 px-6 py-3 bg-white text-black rounded-full font-semibold transition-all duration-300 hover:bg-gray-200 hover:scale-105"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Model;