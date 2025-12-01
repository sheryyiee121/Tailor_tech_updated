import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GLBModelViewer from "../../components/GLBModelViewer";

// Placeholder background image (replace with your chosen image)
import backgroundImage from "../../assets/images/textback.jpg"; // Add your background image here

const Texture = ({ onTextureSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get prompt from state or sessionStorage as fallback
  const statePrompt = location.state?.prompt;
  const sessionPrompt = sessionStorage.getItem('currentPrompt');
  const prompt = statePrompt || sessionPrompt || '';

  // Always show just the dress in texture selection
  const getModelPath = () => {
    // This page should only show dresses, not full models with people
    return '/models/generated.glb'; // Just the dress
  };

  console.log('🎨 Texture component loaded!');
  console.log('📍 Current location:', location.pathname);
  console.log('📝 Received prompt from state:', statePrompt);
  console.log('💾 Prompt from sessionStorage:', sessionPrompt);
  console.log('✅ Final prompt value:', prompt);
  console.log('🔍 Full location state:', location.state);

  // Array of 3D model configurations - all start with the same view
  const modelConfigs = [
    {
      id: 1,
      cameraPosition: [0, 0, 50],
      initialRotation: [0, 0, 0],
      name: "View 1"
    },
    {
      id: 2,
      cameraPosition: [0, 0, 50],
      initialRotation: [0, 0, 0],
      name: "View 2"
    },
    {
      id: 3,
      cameraPosition: [0, 0, 50],
      initialRotation: [0, 0, 0],
      name: "View 3"
    }
  ];

  useEffect(() => {
    console.log('✅ Texture component mounted successfully!');
    console.log('📋 Prompt in useEffect:', prompt);
    console.log('🌍 Window location:', window.location.pathname);
    console.log('📍 React location:', location.pathname);

    // Load the AI model when component mounts
    loadAIModel();

    // Monitor for unexpected navigation
    const checkInterval = setInterval(() => {
      if (window.location.pathname !== '/texture') {
        console.log('⚠️ UNEXPECTED NAVIGATION DETECTED!');
        console.log('📍 Now at:', window.location.pathname);
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

  const loadAIModel = async () => {
    // AI model loading disabled - no backend yet
    console.log('AI model loading skipped - no backend');
  };

  const handleModelClick = (config) => {
    setSelectedImage(config);
  };

  const handleAIGeneration = async () => {
    if (!prompt) {
      setError('No prompt provided for AI generation');
      return;
    }

    // AI Generation disabled - no backend yet
    setError('AI generation is not available yet. Please select a pre-made texture.');
    console.log('AI generation skipped - no backend');
  };

  const handleNext = () => {
    if (selectedImage) {
      const textureData = {
        texture: getModelPath(), // Using the appropriate model based on prompt
        modelConfig: selectedImage, // Pass the selected view configuration
        prompt: prompt,
        isAIGenerated: false
      };
      if (onTextureSelect) {
        onTextureSelect(textureData);
      }
      navigate("/model", { state: textureData });
    }
  };

  const handleUseAIDesign = () => {
    if (generatedDesign) {
      const textureData = {
        texture: generatedDesign.generatedImage,
        prompt: prompt || generatedDesign.prompt,
        isAIGenerated: true
      };
      if (onTextureSelect) {
        onTextureSelect(textureData);
      }
      // Navigate to model page with AI-generated design
      navigate("/model", { state: textureData });
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
        <h2 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-300 drop-shadow-lg text-center">
          AI-POWERED DESIGN GENERATION
        </h2>

        {/* AI Generation Section */}
        <div className="w-full max-w-4xl mb-12">
          <div className="bg-gradient-to-br from-amber-950/80 to-stone-900/80 backdrop-blur-md rounded-2xl p-10 shadow-2xl border border-amber-900/20">
            <h3 className="text-2xl font-bold mb-6 text-amber-200 text-center tracking-wide">
              Generate Custom Design with AI
            </h3>

            {prompt && (
              <div className="mb-8 p-5 bg-gradient-to-r from-amber-900/30 to-stone-800/30 rounded-xl border border-amber-700/20">
                <p className="text-amber-300 font-semibold text-sm uppercase tracking-wider mb-2">Prompt:</p>
                <p className="text-amber-50 text-lg">{prompt}</p>
              </div>
            )}

            {!isGenerating && !generatedDesign && (
              <button
                onClick={handleAIGeneration}
                disabled={!prompt}
                className={`w-full py-5 px-10 rounded-lg font-bold text-lg uppercase tracking-widest transition-all duration-300 transform ${prompt
                  ? "bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white hover:scale-105 shadow-[0_10px_30px_rgba(180,83,9,0.4)] hover:shadow-[0_15px_40px_rgba(180,83,9,0.6)]"
                  : "bg-stone-700 text-stone-500 cursor-not-allowed"
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
        <div className="w-full">
          <h3 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-300 text-center drop-shadow-lg">
            Select Your Dress View
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4">
            {modelConfigs.map((config) => (
              <div
                key={config.id}
                className="relative cursor-pointer"
                onClick={() => handleModelClick(config)}
              >
                {/* 3D Model Viewer - COMPLETELY OPEN */}
                <div className="w-full h-[600px] relative">
                  <GLBModelViewer
                    modelPath={getModelPath()}
                    cameraPosition={config.cameraPosition}
                    initialRotation={config.initialRotation}
                    autoRotate={false}
                    enableControls={true}
                    className="w-full h-full"
                  />

                  {/* Selected Indicator - Simple */}
                  {selectedImage?.id === config.id && (
                    <div className="absolute top-2 left-0 right-0 text-center">
                      <p className="text-green-400 text-sm font-semibold">
                        Selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={handleNext}
              disabled={!selectedImage}
              className={`px-12 py-5 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 transform ${selectedImage
                ? "bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-white hover:scale-105 shadow-[0_10px_30px_rgba(180,83,9,0.4)] hover:shadow-[0_15px_40px_rgba(180,83,9,0.6)]"
                : "bg-stone-700 text-stone-500 cursor-not-allowed"
                }`}
            >
              Continue with Selected View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Texture;