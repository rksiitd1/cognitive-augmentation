import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';

// Neural Network Visualization
const NeuronParticle = ({ position }) => {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    mesh.current.position.y += Math.sin(state.clock.elapsedTime + position[0] * 10) * 0.01;
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color={hovered ? "#00ffff" : "#0077ff"} emissive={hovered ? "#00ffff" : "#0077ff"} emissiveIntensity={2} />
    </mesh>
  );
};

const NeuralNetwork = () => {
  const particles = useRef([]);
  const linesMesh = useRef();

  useEffect(() => {
    particles.current = Array(200).fill().map(() => [
      THREE.MathUtils.randFloatSpread(10),
      THREE.MathUtils.randFloatSpread(10),
      THREE.MathUtils.randFloatSpread(10)
    ]);
  }, []);

  useFrame((state) => {
    if (linesMesh.current) {
      linesMesh.current.rotation.x = state.clock.elapsedTime * 0.1;
      linesMesh.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group>
      {particles.current.map((pos, i) => <NeuronParticle key={i} position={pos} />)}
      <line ref={linesMesh}>
        <bufferGeometry>
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={particles.current.length}
            array={new Float32Array(particles.current.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0077ff" opacity={0.5} transparent />
      </line>
      <Sparkles count={500} scale={10} size={1} speed={0.3} />
    </group>
  );
};

// 3D Text with Glow
const GlowingText = ({ text, position, size = 0.5 }) => {
    return (
      <Text
        position={position}
        fontSize={size}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial emissive="#00ffff" emissiveIntensity={2} />
      </Text>
    );
  };

// Main Scene
const Scene = () => {
    const { camera } = useThree();
  
    useEffect(() => {
      camera.position.z = 5;
    }, [camera]);
  
    return (
      <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <NeuralNetwork />
        <GlowingText text="Cognitive Augmentation" position={[0, 2, 0]} size={0.5} />
        <GlowingText text="The Future is Now" position={[0, -2, 0]} size={0.3} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </>
    );
  };

// Main Component
const CognitiveAugmentationExperience = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-4xl font-bold text-cyan-400"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Initializing Neural Interface...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black">
      <Canvas>
        <Scene />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 text-center text-cyan-300 text-lg bg-black bg-opacity-50 p-4 rounded-lg">
        Experience the future of human cognition. Your mind, augmented beyond imagination.
        <br />
        <span className="text-sm">(Use your mouse or touch to explore the neural network)</span>
      </div>
    </div>
  );
};

export default CognitiveAugmentationExperience;