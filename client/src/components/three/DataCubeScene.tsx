import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

function RotatingCube() {
  const cubeRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (cubeRef.current) {
      cubeRef.current.rotation.x = t * 0.25 + pointer.y * 0.2;
      cubeRef.current.rotation.y = t * 0.35 + pointer.x * 0.3;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.15;
      wireRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group>
        {/* Inner Solid Translucent Core */}
        <mesh ref={cubeRef}>
          <boxGeometry args={[2.2, 2.2, 2.2]} />
          <meshPhysicalMaterial
            color="#7C3AED"
            emissive="#4F46E5"
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.1}
            transmission={0.85}
            thickness={1.2}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Outer Wireframe Cage */}
        <lineSegments ref={wireRef}>
          <edgesGeometry args={[new THREE.BoxGeometry(2.6, 2.6, 2.6)]} />
          <lineBasicMaterial color="#22D3EE" transparent opacity={0.6} />
        </lineSegments>

        {/* Floating Ring Around Cube */}
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.2, 0.03, 16, 64]} />
          <meshBasicMaterial color="#EC4899" transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

export const DataCubeScene: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [webGlSupported, setWebGlSupported] = useState(true);

  if (prefersReducedMotion || !webGlSupported) {
    return (
      <div className="relative w-full h-full min-h-[400px] flex items-center justify-center pointer-events-none select-none">
        <div className="w-56 h-56 rounded-3xl bg-gradient-to-tr from-purple-600/30 via-indigo-600/30 to-cyan-400/30 border border-purple-500/20 blur-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setWebGlSupported(true)}
        onError={() => setWebGlSupported(false)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#C4B5FD" />
        <pointLight position={[-5, -5, -5]} intensity={1} color="#22D3EE" />
        <RotatingCube />
      </Canvas>
    </div>
  );
};

export default DataCubeScene;
