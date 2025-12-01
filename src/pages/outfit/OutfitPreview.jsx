import React, { useState, useEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, PresentationControls, Stage, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    RotateCw,
    Maximize2,
    Package,
    Sparkles,
    Eye,
    Palette,
    Ruler,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import * as THREE from 'three';
import outfitMappingService from '../../services/outfitMappingService';

// Preload models
useGLTF.preload('/models/lady_in_black_dress.glb');
useGLTF.preload('/models/er.glb');
useGLTF.preload('/models/mannequin_female.glb');

// 3D Model Component with Outfit
const MannequinWithOutfit = ({ gender, size, outfitImage, fabric, rotation, prompt }) => {
    const [outfitMaterial, setOutfitMaterial] = useState(null);

    // Load appropriate model based on gender and prompt
    const promptLower = prompt ? prompt.toLowerCase().trim() : '';
    const shouldUseLadyModel = promptLower.includes('lady') ||
        promptLower.includes('black dress') ||
        promptLower.includes('elegant black') ||
        promptLower.includes('evening dress');

    console.log('OutfitPreview - Prompt:', prompt, 'Should use lady model:', shouldUseLadyModel);

    const modelPath = shouldUseLadyModel
        ? '/models/lady_in_black_dress.glb'
        : gender === 'male'
            ? '/models/male-mannequin.glb'
            : '/models/er.glb'; // Using existing female model as fallback

    console.log('Attempting to load model from path:', modelPath);

    // Use the model - hooks can't be conditional
    const modelData = useGLTF(modelPath);
    const { scene } = modelData;
    console.log('MannequinWithOutfit - Model loaded:', modelPath);
    console.log('Scene object:', scene);

    useEffect(() => {
        const loadOutfit = async () => {
            try {
                // Don't apply outfit to pre-dressed models
                if (modelPath.includes('lady_in_black_dress')) {
                    console.log('Skipping outfit application for pre-dressed model');
                    return;
                }

                const material = await outfitMappingService.createOutfitMaterial(outfitImage, fabric);
                setOutfitMaterial(material);

                // Apply material to model
                if (scene) {
                    outfitMappingService.applyOutfitToModel(scene, material, 'full');
                }
            } catch (error) {
                console.error('Failed to load outfit:', error);
            }
        };

        if (outfitImage) {
            loadOutfit();
        }

        return () => {
            if (outfitMaterial) {
                outfitMaterial.dispose();
            }
        };
    }, [outfitImage, fabric, scene, modelPath]);

    return (
        <group rotation={[0, rotation, 0]}>
            <primitive
                object={scene}
                scale={modelPath.includes('lady_in_black_dress') ? 1.5 : 1.8}
                position={[0, modelPath.includes('lady_in_black_dress') ? -1.5 : -1, 0]}
            />
        </group>
    );
};

// Fallback component for loading
const LoadingFallback = () => (
    <mesh>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#cccccc" />
    </mesh>
);

const OutfitPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { gender, mannequinSize, texture, generatedImage, prompt, userMeasurements } = location.state || {};

    console.log('OutfitPreview Page - Full state:', location.state);
    console.log('OutfitPreview Page - Prompt:', prompt);
    console.log('OutfitPreview Page - Texture:', texture);
    console.log('OutfitPreview Page - GeneratedImage:', generatedImage);

    const [rotation, setRotation] = useState(0);
    const [selectedView, setSelectedView] = useState('front');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFabric, setSelectedFabric] = useState('Cotton');
    const [showAdjustments, setShowAdjustments] = useState(false);

    // View presets
    const viewPresets = {
        front: { rotation: 0, label: 'Front', icon: '👤' },
        back: { rotation: Math.PI, label: 'Back', icon: '🔄' },
        left: { rotation: Math.PI / 2, label: 'Left', icon: '◀️' },
        right: { rotation: -Math.PI / 2, label: 'Right', icon: '▶️' }
    };

    const fabricOptions = ['Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Denim', 'Leather'];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    const handleProceedToAnimation = () => {
        navigate('/animation', {
            state: {
                gender,
                mannequinSize,
                texture: generatedImage || texture,
                prompt,
                userMeasurements,
                selectedFabric,
                outfitApplied: true
            }
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleRotate = (direction) => {
        setRotation(prev => prev + (direction === 'left' ? 0.5 : -0.5));
    };

    const handleViewChange = (view) => {
        setSelectedView(view);
        setRotation(viewPresets[view].rotation);
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Model Selection
                    </button>

                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        Outfit Preview
                    </h1>

                    <div className="w-40" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex h-screen pt-20">
                {/* Left Panel - 3D Preview */}
                <div className="flex-1 relative">
                    <AnimatePresence>
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-black"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-gray-400">Applying outfit to mannequin...</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full"
                            >
                                <Canvas
                                    shadows
                                    camera={{ position: [0, 0, 5], fov: 50 }}
                                    className="w-full h-full"
                                >
                                    <color attach="background" args={['#000000']} />
                                    <fog attach="fog" args={['#000000', 5, 15]} />

                                    <Suspense fallback={<LoadingFallback />}>
                                        <PresentationControls
                                            speed={1.5}
                                            global
                                            polar={[-0.1, Math.PI / 4]}
                                            rotation={[0.13, 0.1, 0]}
                                        >
                                            <MannequinWithOutfit
                                                key={prompt} // Force remount when prompt changes
                                                gender={gender}
                                                size={mannequinSize}
                                                outfitImage={(prompt && prompt.toLowerCase().includes('lady')) ? null : (generatedImage || texture)}
                                                fabric={selectedFabric}
                                                rotation={rotation}
                                                prompt={prompt}
                                            />
                                        </PresentationControls>
                                    </Suspense>

                                    <ambientLight intensity={0.5} />
                                    <spotLight
                                        position={[10, 10, 10]}
                                        angle={0.15}
                                        penumbra={1}
                                        intensity={1}
                                        castShadow
                                    />
                                    <ContactShadows
                                        position={[0, -1, 0]}
                                        opacity={0.5}
                                        scale={10}
                                        blur={2.5}
                                        far={4}
                                    />
                                    <OrbitControls
                                        enablePan={false}
                                        minDistance={3}
                                        maxDistance={10}
                                        minPolarAngle={Math.PI / 4}
                                        maxPolarAngle={Math.PI / 2}
                                    />
                                </Canvas>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* View Controls */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/10 backdrop-blur-md rounded-full p-2">
                        {Object.entries(viewPresets).map(([key, preset]) => (
                            <button
                                key={key}
                                onClick={() => handleViewChange(key)}
                                className={`px-4 py-2 rounded-full transition-all ${selectedView === key
                                    ? 'bg-white text-black'
                                    : 'bg-transparent text-white hover:bg-white/20'
                                    }`}
                            >
                                <span className="mr-2">{preset.icon}</span>
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    {/* Manual Rotation Controls */}
                    <button
                        onClick={() => handleRotate('left')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => handleRotate('right')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Right Panel - Details & Controls */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-96 bg-gray-900 p-8 overflow-y-auto"
                >
                    <h2 className="text-2xl font-bold mb-6">Outfit Details</h2>

                    {/* Original Design */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Original Design
                        </h3>
                        <div className="relative rounded-lg overflow-hidden">
                            <img
                                src={generatedImage || texture}
                                alt="Generated outfit"
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <p className="text-sm text-gray-300">{prompt}</p>
                            </div>
                        </div>
                    </div>

                    {/* Fabric Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Fabric Material
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {fabricOptions.map((fabric) => (
                                <button
                                    key={fabric}
                                    onClick={() => setSelectedFabric(fabric)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all ${selectedFabric === fabric
                                        ? 'bg-white text-black'
                                        : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                >
                                    {fabric}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Ruler className="w-5 h-5" />
                            Size & Fit
                        </h3>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Gender:</span>
                                <span className="capitalize">{gender}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Size:</span>
                                <span className="capitalize">{mannequinSize}</span>
                            </div>
                            {userMeasurements && (
                                <button
                                    onClick={() => setShowAdjustments(!showAdjustments)}
                                    className="text-blue-400 text-sm hover:text-blue-300 mt-2"
                                >
                                    View Measurements
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleProceedToAnimation}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            See on Runway
                        </button>

                        <button
                            onClick={() => navigate('/custom-order', {
                                state: {
                                    ...location.state,
                                    selectedFabric,
                                    previewCompleted: true
                                }
                            })}
                            className="w-full bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Package className="w-5 h-5" />
                            Order This Outfit
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OutfitPreview;
