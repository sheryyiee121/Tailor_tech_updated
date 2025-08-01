import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";

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

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-black"
    >
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