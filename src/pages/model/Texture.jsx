import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import aiGenerationService from "../../services/aiGenerationService";

// Placeholder background image (replace with your chosen image)
import backgroundImage from "../../assets/images/textback.jpg"; // Add your background image here

// Placeholder model ramp images (replace with your sourced images)
import image1 from "../../assets/images/cube.png"; // Cone-shaped ramp image 1
import image2 from "../../assets/images/cube.png"; // Cone-shaped ramp image 2
import image3 from "../../assets/images/cube.png"; // Cone-shaped ramp image 3

const Texture = ({ onTextureSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { prompt } = location.state || {};

  // Array of images (no names or IDs needed)
  const images = [image1, image2, image3];

  useEffect(() => {
    // Load the AI model when component mounts
    loadAIModel();
  }, []);

  const loadAIModel = async () => {
    try {
      await aiGenerationService.loadModel();
      console.log('AI model loaded successfully');
    } catch (error) {
      console.error('Failed to load AI model:', error);
      setError('Failed to load AI model. Please refresh the page.');
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleAIGeneration = async () => {
    if (!prompt) {
      setError('No prompt provided for AI generation');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Generate design using AI
      const result = await aiGenerationService.generateDesign(prompt);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      setGeneratedDesign(result);
      console.log('AI generation result:', result);

    } catch (error) {
      console.error('AI generation failed:', error);
      setError('AI generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (selectedImage) {
      if (onTextureSelect) {
        onTextureSelect(selectedImage);
      }
      navigate("/model", { state: { prompt, texture: selectedImage } });
    }
  };

  const handleUseAIDesign = () => {
    if (generatedDesign) {
      // Navigate to model page with AI-generated design
      navigate("/model", {
        state: {
          prompt,
          texture: generatedDesign.generatedImage,
          isAIGenerated: true
        }
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-screen bg-black text-white font-poppins bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-5xl font-extrabold mb-8 text-white drop-shadow-lg text-center">
          AI-POWERED DESIGN GENERATION
        </h2>

        {/* AI Generation Section */}
        <div className="w-full max-w-4xl mb-12">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-4 text-blue-300">
              Generate Custom Design with AI
            </h3>

            {prompt && (
              <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <p className="text-blue-200 font-medium">Prompt:</p>
                <p className="text-white">{prompt}</p>
              </div>
            )}

            {!isGenerating && !generatedDesign && (
              <button
                onClick={handleAIGeneration}
                disabled={!prompt}
                className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${prompt
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:scale-105 shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
              >
                🎨 Generate AI Design
              </button>
            )}

            {/* Generation Progress */}
            {isGenerating && (
              <div className="space-y-4">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-blue-300">
                  Generating your design... {generationProgress}%
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Generated Result */}
        {generatedDesign && (
          <div className="w-full max-w-4xl mb-12">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
              <h3 className="text-2xl font-bold mb-4 text-green-300">
                ✨ AI Generated Design
              </h3>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <img
                    src={generatedDesign.generatedImage}
                    alt="AI Generated Design"
                    className="w-64 h-64 object-cover rounded-xl border-2 border-green-400/50"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-green-200 font-medium">Generated from:</p>
                    <p className="text-white">{generatedDesign.prompt}</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleUseAIDesign}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      Use This Design
                    </button>

                    <button
                      onClick={() => {
                        setGeneratedDesign(null);
                        setGenerationProgress(0);
                      }}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
                    >
                      Generate New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Traditional Texture Selection */}
        <div className="w-full max-w-4xl">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-6 text-blue-300 text-center">
              Or Select Pre-made Texture
            </h3>

            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(image)}
                  className={`cursor-pointer transform transition-all duration-300 hover:scale-110 ${selectedImage === image ? 'ring-4 ring-blue-400' : ''
                    }`}
                >
                  <img
                    src={image}
                    alt={`Texture ${index + 1}`}
                    className="w-40 h-60 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                disabled={!selectedImage}
                className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${selectedImage
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:scale-105 shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Continue with Selected Texture
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Texture;