import React, { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/images/textback.jpg";
import maleSmall from "../../assets/images/male-small.png";
import maleMedium from "../../assets/images/male-Medium.png";
import maleLarge from "../../assets/images/male-large.png";
import femaleSmall from "../../assets/images/Female-small.png";
import femaleMedium from "../../assets/images/Female-medium.png";
import femaleLarge from "../../assets/images/Female-large.png";
import mannequinGeneratorService from "../../services/mannequinGeneratorService";
import { Camera, Sparkles, ChartBar, PlayCircle } from "lucide-react";

// Lazy load the body measurement component
const SimpleBodyMeasurement = lazy(() => import("../../components/BodyMeasurement/SimpleBodyMeasurement"));

const Model = ({ selectedTexture }) => {
  const [gender, setGender] = useState("");
  const [mannequinSize, setMannequinSize] = useState("");
  const [showBodyMeasurement, setShowBodyMeasurement] = useState(false);
  const [customMannequin, setCustomMannequin] = useState(null);
  const [userMeasurements, setUserMeasurements] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (gender && (mannequinSize || customMannequin)) {
      // Navigate to outfit preview page first
      navigate("/outfit-preview", {
        state: {
          gender,
          mannequinSize,
          texture: selectedTexture?.texture || selectedTexture,
          generatedImage: selectedTexture?.texture || selectedTexture,
          prompt: selectedTexture?.prompt,
          customMannequin,
          userMeasurements
        },
      });
    }
  };

  const [pakistaniBrandSizes, setPakistaniBrandSizes] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const handleMeasurementsComplete = (measurements) => {
    setUserMeasurements(measurements);
    setShowBodyMeasurement(false);

    // Find closest preset size based on measurements
    const closestSize = mannequinGeneratorService.findClosestPreset(measurements, gender);
    setMannequinSize(closestSize);

    // Get Pakistani brand size recommendations
    const brandSizes = mannequinGeneratorService.getPakistaniBrandSizes(measurements, gender);
    setPakistaniBrandSizes(brandSizes);

    // Auto-select the recommended mannequin
    setCustomMannequin(null); // Don't generate 3D model
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
            setMannequinSize("");
            setCustomMannequin(null);
            setUserMeasurements(null);
          }}
          className="w-80 p-4 bg-gray-200 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-300 transition-all duration-300 text-xl"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Selection Mode - Traditional or Body Measurement */}
        {gender && !showBodyMeasurement && (
          <div className="flex flex-col items-center space-y-6">
            {/* Body Measurement Option */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Dynamic Body Measurement (Beta)
              </h3>
              <p className="text-white/80 mb-4 text-center max-w-md">
                Use AI to measure your body from photos and create a custom-fitted 3D mannequin
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowBodyMeasurement(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Use Body Measurement</span>
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDemoVideo(true)}
                  className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch Demo First
                </button>
              </div>
            </div>

            <div className="text-white text-lg font-semibold">OR</div>

            {/* Traditional Mannequin Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white text-center flex-1">
                  Select Standard Size
                </h3>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                >
                  <ChartBar className="w-4 h-4" />
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {sizes.map((size) => (
                  <div
                    key={size}
                    onClick={() => {
                      setMannequinSize(size);
                      setCustomMannequin(null);
                      setUserMeasurements(null);
                    }}
                    className={`cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 hover:brightness-110 rounded-lg overflow-hidden relative ${mannequinSize === size && !customMannequin ? "ring-4 ring-white" : ""
                      } ${userMeasurements && mannequinSize === size ? "ring-4 ring-green-400" : ""}`}
                  >
                    {userMeasurements && mannequinSize === size && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                        Recommended
                      </div>
                    )}
                    <img
                      src={mannequins[gender][size]}
                      alt={`${gender}-${size}`}
                      className="w-48 h-64 object-contain opacity-0 transition-opacity duration-500"
                      onLoad={(e) => (e.target.style.opacity = "1")}
                    />
                    <p className="text-center text-white mt-2 capitalize">{size}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Body Measurement Component */}
        {showBodyMeasurement && (
          <div className="w-full max-w-4xl">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
              </div>
            }>
              <SimpleBodyMeasurement onMeasurementsComplete={handleMeasurementsComplete} />
            </Suspense>
            <button
              onClick={() => setShowBodyMeasurement(false)}
              className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Display Measurement Results */}
        {userMeasurements && mannequinSize && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-4xl">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              ✨ Based on Your Measurements
            </h3>

            {/* Recommended Size */}
            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 mb-6">
              <p className="text-center text-white text-lg">
                Recommended Size: <span className="font-bold text-2xl uppercase text-green-400">{mannequinSize}</span>
              </p>
            </div>

            {/* Measurements Display */}
            <div className="grid grid-cols-2 gap-3 text-white mb-6">
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-gray-300 text-sm">Height:</span>
                <p className="font-semibold">{userMeasurements.height} cm</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-gray-300 text-sm">Chest:</span>
                <p className="font-semibold">{userMeasurements.chest} cm</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-gray-300 text-sm">Waist:</span>
                <p className="font-semibold">{userMeasurements.waist} cm</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-gray-300 text-sm">Body Type:</span>
                <p className="font-semibold capitalize">{userMeasurements.bodyType}</p>
              </div>
            </div>

            {/* Pakistani Brand Recommendations */}
            {pakistaniBrandSizes && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Pakistani Brand Sizes:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(pakistaniBrandSizes).map(([brand, sizeInfo]) => (
                    <div key={brand} className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-gray-300 text-sm capitalize">{brand.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-white font-bold text-lg">{sizeInfo.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Chart Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ChartBar className="w-4 h-4" />
                {showSizeChart ? 'Hide' : 'Show'} Size Chart
              </button>
            </div>

            <p className="text-white/60 text-sm text-center">
              The <span className="font-semibold uppercase">{mannequinSize}</span> mannequin has been automatically selected for you
            </p>
          </div>
        )}

        {/* Prompt to select */}
        {gender && !mannequinSize && !customMannequin && !showBodyMeasurement && (
          <p className="text-white mt-4">Choose a measurement method above</p>
        )}

        {/* Demo Video Modal */}
        {showDemoVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Body Measurement Demo</h3>
                <button
                  onClick={() => setShowDemoVideo(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  autoPlay
                  className="w-full h-full"
                  src="/videos/SnapMeasureAI_showcase.mp4"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-gray-300">
                  Learn how our AI-powered body measurement system works:
                </p>
                <ul className="text-gray-400 space-y-2 list-disc list-inside">
                  <li>Quick and easy measurement process</li>
                  <li>No special equipment needed</li>
                  <li>Get accurate size recommendations</li>
                  <li>Works with Pakistani brand sizing</li>
                </ul>
                <button
                  onClick={() => {
                    setShowDemoVideo(false);
                    setShowBodyMeasurement(true);
                  }}
                  className="w-full mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Start Body Measurement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Size Chart Modal */}
        {showSizeChart && gender && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Pakistani Brand Size Chart - {gender === 'male' ? 'Men' : 'Women'}
              </h3>

              {Object.entries(mannequinGeneratorService.getSizeChart(gender)).map(([brand, sizes]) => (
                <div key={brand} className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                    {brand.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-gray-400 pb-2 pr-4">Size</th>
                          <th className="text-gray-400 pb-2 pr-4">Label</th>
                          <th className="text-gray-400 pb-2 pr-4">Chest (cm)</th>
                          <th className="text-gray-400 pb-2 pr-4">Waist (cm)</th>
                          {gender === 'female' && <th className="text-gray-400 pb-2">Hips (cm)</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(sizes).map(([sizeName, sizeData]) => (
                          <tr key={sizeName} className="border-b border-gray-800">
                            <td className="text-white py-2 pr-4 capitalize">{sizeName}</td>
                            <td className="text-white py-2 pr-4 font-semibold">{sizeData.label}</td>
                            <td className="text-white py-2 pr-4">{sizeData.chest}</td>
                            <td className="text-white py-2 pr-4">{sizeData.waist}</td>
                            {gender === 'female' && <td className="text-white py-2">{sizeData.hips}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowSizeChart(false)}
                className="mt-6 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Next Button */}
        {gender && (mannequinSize || customMannequin) && (
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