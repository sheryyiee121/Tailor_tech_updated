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

// Model3D Component (with outfit texture support)
const Model3D = ({ isAnimating, outfitTexture, fabric, prompt }) => {
  const group = useRef();

  // Choose model based on prompt
  console.log('Animation page - Prompt received:', prompt);
  const promptLower = prompt ? prompt.toLowerCase().trim() : '';
  // More flexible matching
  const shouldUseLadyModel = promptLower.includes('lady') ||
    promptLower.includes('black dress') ||
    promptLower.includes('elegant black') ||
    promptLower.includes('evening dress');
  const modelPath = shouldUseLadyModel
    ? "/models/lady_in_black_dress.glb"
    : "/models/er.glb";
  console.log('Prompt lower:', promptLower);
  console.log('Should use lady model:', shouldUseLadyModel);
  console.log('Model path selected:', modelPath);

  const { scene: girlScene, animations } = useGLTF(modelPath);
  const { scene: spotlightScene } = useGLTF("/models/spotlight.glb");
  const { actions } = useAnimations(animations, group);
  const direction = useRef(1);

  // Apply outfit texture if provided (but not for pre-dressed models like lady_in_black_dress)
  useEffect(() => {
    const isPreDressedModel = modelPath.includes('lady_in_black_dress');
    if (outfitTexture && girlScene && !isPreDressedModel) {
      const loadOutfit = async () => {
        try {
          const { default: outfitMappingService } = await import('../../services/outfitMappingService');
          const material = await outfitMappingService.createOutfitMaterial(outfitTexture, fabric || 'Cotton');
          outfitMappingService.applyOutfitToModel(girlScene, material, 'full');
        } catch (error) {
          console.error('Failed to apply outfit:', error);
        }
      };
      loadOutfit();
    }
  }, [outfitTexture, fabric, girlScene, modelPath]);

  useEffect(() => {
    const walkAction = actions["mixamo.com"] || actions[animations[0]?.name];
    if (walkAction) {
      walkAction.reset().fadeIn(0.8).play();
      walkAction.timeScale = 0.8; // Slightly slower walk
      if (!isAnimating) walkAction.paused = true;
    }
    return () => {
      if (walkAction) walkAction.fadeOut(0.2);
    };
  }, [actions, animations, isAnimating]);

  useFrame((_, delta) => {
    if (group.current && isAnimating) {
      // Walk forward (negative z direction)
      group.current.position.z -= direction.current * delta * 1.5; // Walking towards camera

      // Turn around at the ends of the runway
      if (group.current.position.z < -10) {
        // Reached front, turn around
        group.current.position.z = -10;
        direction.current = -1;
        group.current.rotation.y = Math.PI; // Face backwards
      } else if (group.current.position.z > 10) {
        // Reached back, turn around
        group.current.position.z = 10;
        direction.current = 1;
        group.current.rotation.y = 0; // Face forward
      }
    }
  });

  return (
    <group ref={group} position={[0, 0, 10]} rotation={[0, 0, 0]}>
      <primitive object={girlScene} scale={2.2} />
      <primitive object={spotlightScene} scale={0.6} position={[-1, 4.5, 0]} />
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

  const { prompt, texture, gender, mannequinSize, selectedFabric, outfitApplied } = location.state || {};

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
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black overflow-hidden">
      {/* Compact Side Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 flex flex-col gap-2">
          <h1 className="text-lg font-bold text-white">Fashion Runway</h1>
          {outfitApplied && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Outfit Applied
            </span>
          )}
        </div>

        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isAnimating
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
        >
          {isAnimating ? 'Pause' : 'Start'} Show
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300"
        >
          Back
        </button>
      </div>

      {/* Design Info Panel */}
      {prompt && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-24 left-6 z-10 bg-black/70 backdrop-blur-md rounded-xl p-5 max-w-sm border border-white/10"
        >
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">✨</span>
            Design Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Prompt</p>
              <p className="text-white text-sm">"{prompt}"</p>
            </div>
            {texture && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Preview</p>
                <img
                  src={texture}
                  alt="Design texture"
                  className="w-24 h-24 object-cover rounded-lg border border-white/20"
                />
              </div>
            )}
            {selectedFabric && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Fabric</p>
                <p className="text-white text-sm">{selectedFabric}</p>
              </div>
            )}
          </div>

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


      {/* Animation Status Badge */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-24 right-6 z-10"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-full px-4 py-2 border border-purple-400/30 flex items-center gap-2">
            <div className="relative">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-purple-200 text-sm font-medium">Live Show</span>
          </div>
        </motion.div>
      )}

      {/* Side Action Panel */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10"
      >
        <div className="bg-black/70 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          {/* Title */}
          <h3 className="text-white font-semibold text-lg mb-4 text-center">
            Next Steps
          </h3>

          {/* Instructions */}
          <p className="text-white/70 text-sm text-center mb-6 max-w-xs">
            Love this design? Choose an option below
          </p>

          {/* Buttons - Vertical Stack */}
          <div className="space-y-3">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              onClick={handleSearchSimilar}
              className="group w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Find Similar Items
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              onClick={handleImageUploadClick}
              className="group w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Upload & Search
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              onClick={handleCustomOrder}
              className="group w-full px-6 py-4 bg-white hover:bg-gray-100 text-black rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105 border border-gray-200"
            >
              <Package className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Order Custom
            </motion.button>
          </div>
        </div>
      </motion.div>

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
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 2.5, 15], fov: 45 }}
          className="w-full h-full"
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5
          }}
        >
          {/* Fog for depth */}
          <fog attach="fog" args={['#1a1a1a', 15, 30]} />

          {/* Lighting Setup */}
          <ambientLight intensity={0.8} />
          {/* Key Light - Main overhead */}
          <spotLight
            position={[0, 15, 5]}
            angle={0.8}
            penumbra={0.5}
            intensity={3}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
            color="#ffffff"
            target-position={[0, 0, 0]}
          />

          {/* Fill Light - Front */}
          <directionalLight
            position={[5, 10, 15]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="#ffffff"
          />

          {/* Additional front light for visibility */}
          <pointLight
            position={[0, 5, 10]}
            intensity={2}
            color="#ffffff"
            distance={20}
          />
          {/* Rim Lights - Brighter */}
          <spotLight
            position={[4, 8, -5]}
            angle={0.4}
            penumbra={0.3}
            intensity={2}
            color="#ffffff"
            target-position={[0, 2, 0]}
          />
          <spotLight
            position={[-4, 8, -5]}
            angle={0.4}
            penumbra={0.3}
            intensity={2}
            color="#ffffff"
            target-position={[0, 2, 0]}
          />

          {/* Floor bounce lights */}
          <pointLight position={[3, 1, 5]} color="#ffffff" intensity={1} distance={10} />
          <pointLight position={[-3, 1, 5]} color="#ffffff" intensity={1} distance={10} />
          {/* Runway Floor - Raised and brighter */}
          <mesh
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[10, 25]} />
            <meshStandardMaterial
              color="#3a3a3a"
              roughness={0.7}
              metalness={0.3}
              envMapIntensity={0.3}
            />
          </mesh>

          {/* Runway Center Line */}
          <mesh
            position={[0, 0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.3, 25]} />
            <meshStandardMaterial
              color="#cccccc"
              emissive="#ffffff"
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* Side runway lights */}
          {[-4, 4].map((x, i) => (
            <group key={i}>
              {[...Array(5)].map((_, j) => (
                <mesh key={j} position={[x, 0.02, -10 + j * 5]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
                  <meshStandardMaterial
                    color="#ffff00"
                    emissive="#ffff00"
                    emissiveIntensity={0.5}
                  />
                </mesh>
              ))}
            </group>
          ))}
          {/* 3D Model */}
          <Model3D
            isAnimating={isAnimating}
            outfitTexture={outfitApplied ? texture : null}
            fabric={selectedFabric}
            prompt={prompt}
          />

          {/* Audio */}
          <RampMusic isPlaying={isAnimating} />

          {/* Disco Lights */}
          <DiscoLights />

          {/* Camera Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={8}
            maxDistance={20}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default WalkCanvas;