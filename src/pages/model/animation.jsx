import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Package, Upload, Image as ImageIcon, History } from "lucide-react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import promptStorageService from "../../services/promptStorageService";

// Audio Component
const RampMusic = ({ isPlaying }) => {
  const { camera } = useThree();
  const audioLoader = new THREE.AudioLoader();
  const listener = new THREE.AudioListener();
  const sound = useRef(new THREE.Audio(listener));

  useEffect(() => {
    camera.add(listener); // Add listener to the camera

    // Load and set up the audio
    audioLoader.load("/ramp.mp3", (buffer) => {
      sound.current.setBuffer(buffer);
      sound.current.setLoop(true);
      sound.current.setVolume(0.5);
    });

    return () => {
      sound.current.stop();
      camera.remove(listener);
    };
  }, [camera]);

  useEffect(() => {
    if (isPlaying && !sound.current.isPlaying) {
      sound.current.play();
    } else if (!isPlaying && sound.current.isPlaying) {
      sound.current.stop();
    }
  }, [isPlaying]);

  return null; // This component doesn't render anything visually
};

// Disco Lights Component
const DiscoLights = () => {
  const light1 = useRef();
  const light2 = useRef();
  const light3 = useRef();

  useFrame((_, delta) => {
    const time = Date.now() * 0.005; // Speed of rotation
    if (light1.current) {
      light1.current.position.x = Math.sin(time) * 5;
      light1.current.position.z = Math.cos(time) * 5;
    }
    if (light2.current) {
      light2.current.position.x = Math.sin(time + Math.PI / 2) * 5;
      light2.current.position.z = Math.cos(time + Math.PI / 2) * 5;
    }
    if (light3.current) {
      light3.current.position.x = Math.sin(time + Math.PI) * 5;
      light3.current.position.z = Math.cos(time + Math.PI) * 5;
    }
  });

  return (
    <>
      <pointLight ref={light1} color="#ff0000" intensity={2} distance={20} position={[0, 5, 0]} />
      <pointLight ref={light2} color="#00ff00" intensity={2} distance={20} position={[0, 5, 0]} />
      <pointLight ref={light3} color="#0000ff" intensity={2} distance={20} position={[0, 5, 0]} />
    </>
  );
};

// Model3D Component (with slowest walking speed)
const Model3D = ({ isAnimating }) => {
  const group = useRef();
  const { scene: girlScene, animations } = useGLTF("/models/er.glb");
  const { scene: spotlightScene } = useGLTF("/models/spotlight.glb"); // Load the spotlight model
  const { actions } = useAnimations(animations, group);
  const direction = useRef(1);

  useEffect(() => {
    const walkAction = actions["mixamo.com"] || actions[animations[0]?.name];
    if (walkAction) {
      walkAction.reset().fadeIn(0.8).play();
      if (!isAnimating) walkAction.paused = true;
    }
    return () => {
      if (walkAction) walkAction.fadeOut(0.2);
    };
  }, [actions, animations, isAnimating]);

  useFrame((_, delta) => {
    if (group.current && isAnimating) {
      group.current.position.z += direction.current * delta * 0.02; // Slowest speed (reduced from 0.1 to 0.02)
      if (group.current.position.z < -5 || group.current.position.z > 5) {
        direction.current *= -1;
        group.current.rotation.y += Math.PI;
      }
    }
  });

  return (
    <group ref={group} position={[0, 0, 5]}>
      <primitive object={girlScene} scale={2} />
      <primitive object={spotlightScene} scale={0.5} position={[-1, 3, 0]} /> {/* Spotlight position unchanged */}
    </group>
  );
};

// Main WalkCanvas Component
const WalkCanvas = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPromptHistory, setShowPromptHistory] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { prompt, texture, gender, mannequinSize } = location.state || {};

  // Auto-stop animation after 30 seconds and show search options
  useEffect(() => {
    let timer;
    if (isAnimating) {
      timer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationComplete(true);
        setShowSearchOptions(true);
      }, 30000); // 30 seconds
    }
    return () => clearTimeout(timer);
  }, [isAnimating]);

  const handleSearchSimilar = () => {
    // Use saved prompt if current prompt is not available
    const searchPrompt = prompt || promptStorageService.getCurrentPrompt();

    navigate('/search-results', {
      state: {
        prompt: searchPrompt,
        generatedImage: texture,
        modelData: { gender, mannequinSize }
      }
    });

    console.log(`🔍 Navigating to search with prompt: "${searchPrompt}"`);
  };

  const handleCustomOrder = () => {
    // Use saved prompt if current prompt is not available
    const searchPrompt = prompt || promptStorageService.getCurrentPrompt();

    navigate('/custom-order', {
      state: {
        prompt: searchPrompt,
        generatedImage: texture,
        modelData: { gender, mannequinSize },
        searchResults: false
      }
    });

    console.log(`📦 Navigating to custom order with prompt: "${searchPrompt}"`);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setUploadedImage(previewUrl);

      // Navigate to search results with uploaded image
      navigate('/search-results', {
        state: {
          prompt: 'uploaded image',
          generatedImage: previewUrl,
          modelData: { gender, mannequinSize },
          uploadedFile: file
        }
      });
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUploadClick = () => {
    setShowImageUpload(true);
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-black"
    >
      {/* Design Info */}
      {prompt && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-lg p-4 max-w-sm"
        >
          <h3 className="text-white font-semibold mb-2">Current Design:</h3>
          <p className="text-gray-300 text-sm">"{prompt}"</p>
          {texture && (
            <div className="mt-3">
              <img
                src={texture}
                alt="Design texture"
                className="w-16 h-16 object-cover rounded-lg border border-white/20"
              />
            </div>
          )}

          {/* Saved Prompt Status */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-green-400 text-xs">✅ Saved at Runtime</span>
              <button
                onClick={() => setShowPromptHistory(!showPromptHistory)}
                className="text-white/70 hover:text-white text-xs flex items-center"
              >
                <History className="w-3 h-3 mr-1" />
                History
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Current: "{promptStorageService.getCurrentPrompt() || 'None'}"
            </p>
          </div>
        </motion.div>
      )}

      {/* Prompt History Debug Panel */}
      {showPromptHistory && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 left-80 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold text-sm">Saved Prompts</h4>
            <button
              onClick={() => setShowPromptHistory(false)}
              className="text-white/70 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-green-400 text-xs">
              Current: {promptStorageService.getCurrentPrompt() || 'None'}
            </div>

            <div className="text-gray-300 text-xs">
              <div className="font-medium mb-1">Recent History:</div>
              {promptStorageService.getRecentPrompts(5).map((savedPrompt, index) => (
                <div key={index} className="text-gray-400 text-xs truncate">
                  {index + 1}. "{savedPrompt}"
                </div>
              ))}
              {promptStorageService.getRecentPrompts().length === 0 && (
                <div className="text-gray-500 text-xs">No saved prompts</div>
              )}
            </div>

            <div className="text-blue-400 text-xs">
              Total: {promptStorageService.getPromptHistory().length} prompts
            </div>
          </div>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <button
          onClick={() => setIsAnimating(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Start
        </button>
        <button
          onClick={() => setIsAnimating(false)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Stop
        </button>
      </div>

      {/* Animation Status */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 right-4 z-10 bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30"
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm font-medium">Animation Running</span>
          </div>
        </motion.div>
      )}

      {/* Action Buttons - Always Visible */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-4">
          {/* Instructions */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-white/70 text-sm text-center"
          >
            Love this design? Find similar items or order a custom piece!
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              onClick={handleSearchSimilar}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Find This Design
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              onClick={handleImageUploadClick}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload & Search
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              onClick={handleCustomOrder}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-lg font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Package className="w-5 h-5 mr-2" />
              Custom Order
            </motion.button>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Upload Image to Search 📸
            </h3>
            <p className="text-gray-300 text-center mb-8">
              Upload any fashion image to find similar items online
            </p>

            <div className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center cursor-pointer">
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Choose Image File
                    </>
                  )}
                </div>
              </label>

              <button
                onClick={() => setShowImageUpload(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search Options Modal */}
      {showSearchOptions && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Animation Complete! 🎉
            </h3>
            <p className="text-gray-300 text-center mb-8">
              What would you like to do with your design?
            </p>

            <div className="space-y-4">
              <button
                onClick={handleSearchSimilar}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Similar Items Online
              </button>

              <button
                onClick={handleCustomOrder}
                className="w-full bg-white hover:bg-gray-100 text-black py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <Package className="w-5 h-5 mr-2" />
                Place Custom Order
              </button>

              <button
                onClick={() => setShowSearchOptions(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
              >
                Continue Watching
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <Canvas
        shadows
        camera={{ position: [0, 3, 10], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={2} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.7}
          penumbra={0.5}
          intensity={3}
          castShadow
          target-position={[0, 0, 0]}
        />
        <directionalLight
          position={[0, 5, 10]}
          intensity={2}
          castShadow
        />
        {/* Additional spotlights targeting her face */}
        <spotLight
          position={[2, 5, 8]}
          angle={0.3}
          penumbra={0.5}
          intensity={2}
          castShadow
          target-position={[0, 1.5, 0]} // Targeting her face (approx. height)
        />
        <spotLight
          position={[-2, 5, 8]}
          angle={0.3}
          penumbra={0.5}
          intensity={2}
          castShadow
          target-position={[0, 1.5, 0]} // Targeting her face (approx. height)
        />
        {/* Back corner lights */}
        <pointLight position={[5, 2, -5]} color="#ffffff" intensity={1.5} distance={10} />
        <pointLight position={[-5, 2, -5]} color="#ffffff" intensity={1.5} distance={10} />
        <mesh
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[5, 10]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <Model3D isAnimating={isAnimating} />
        <RampMusic isPlaying={isAnimating} />
        <DiscoLights /> {/* Add the disco lights */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default WalkCanvas;