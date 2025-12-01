import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

// Model component that loads and displays the GLB
const Model = ({ modelPath, rotation = [0, 0, 0], autoRotate = false }) => {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef();

    // Clone the scene to avoid sharing materials between instances
    const clonedScene = scene.clone();

    // Auto-rotate the model if enabled
    useFrame((state, delta) => {
        if (autoRotate && modelRef.current) {
            modelRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={clonedScene}
            rotation={rotation}
            scale={1}
        />
    );
};

// Main viewer component
const GLBModelViewer = ({
    modelPath = '/models/generated.glb',
    cameraPosition = [0, 0, 20],
    cameraFov = 40,
    autoRotate = false,
    initialRotation = [0, 0, 0],
    enableControls = true,
    className = '',
    onClick = null
}) => {
    return (
        <div className={`w-full h-full ${className}`} onClick={onClick}>
            <Canvas
                camera={{ position: cameraPosition, fov: cameraFov }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                    preserveDrawingBuffer: true
                }}
            >
                <Suspense fallback={null}>
                    {/* Much brighter lighting for visibility */}
                    <ambientLight intensity={1.5} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.5}
                        penumbra={1}
                        intensity={2}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                    />
                    <spotLight
                        position={[-10, 10, -10]}
                        angle={0.5}
                        penumbra={1}
                        intensity={2}
                    />
                    <spotLight
                        position={[0, 10, 0]}
                        angle={0.5}
                        penumbra={1}
                        intensity={2}
                    />
                    <directionalLight
                        position={[0, 5, 10]}
                        intensity={1.5}
                    />
                    <directionalLight
                        position={[5, 5, -10]}
                        intensity={1}
                    />


                    {/* Model */}
                    <group position={[0, -5, 0]}>
                        <Center scale={0.1}>
                            <Model
                                modelPath={modelPath}
                                rotation={initialRotation}
                                autoRotate={autoRotate}
                            />
                        </Center>
                    </group>


                    {/* Controls - Always enabled for user interaction */}
                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableDamping={true}
                        dampingFactor={0.05}
                        rotateSpeed={0.5}
                        minDistance={5}
                        maxDistance={20}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI}
                        autoRotate={autoRotate}
                        autoRotateSpeed={2}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default GLBModelViewer;
