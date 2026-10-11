import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';
import { SUBJECT_THEMES } from '../../lib/constants';

interface OrbData {
  key: string;
  name: string;
  color: string;
  radius: number;
  speed: number;
  size: number;
  yOffset: number;
}

const ORB_CONFIGS: OrbData[] = [
  { key: 'dbms', name: 'DBMS & SQL', color: '#22D3EE', radius: 3.2, speed: 0.45, size: 0.35, yOffset: 0.2 },
  { key: 'oop', name: 'OOP', color: '#8B5CF6', radius: 4.1, speed: 0.38, size: 0.38, yOffset: -0.4 },
  { key: 'os', name: 'Operating Systems', color: '#FB923C', radius: 5.0, speed: 0.32, size: 0.42, yOffset: 0.5 },
  { key: 'cn', name: 'Networks', color: '#34D399', radius: 5.9, speed: 0.27, size: 0.36, yOffset: -0.3 },
  { key: 'devops', name: 'DevOps', color: '#FBBF24', radius: 6.8, speed: 0.22, size: 0.34, yOffset: 0.4 },
  { key: 'ca', name: 'Architecture', color: '#38BDF8', radius: 7.6, speed: 0.19, size: 0.30, yOffset: -0.5 },
  { key: 'sd', name: 'System Design', color: '#6366F1', radius: 8.5, speed: 0.16, size: 0.40, yOffset: 0.3 },
  { key: 'ai', name: 'GenAI & AI', color: '#F472B6', radius: 9.4, speed: 0.14, size: 0.38, yOffset: -0.2 },
];

function OrbitingOrb({ orb }: { orb: OrbData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * orb.speed;
    meshRef.current.position.x = Math.cos(t) * orb.radius;
    meshRef.current.position.z = Math.sin(t) * orb.radius;
    meshRef.current.position.y = orb.yOffset + Math.sin(t * 2) * 0.25;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.4 : 1}
    >
      <sphereGeometry args={[orb.size, 32, 32]} />
      <meshStandardMaterial
        color={orb.color}
        emissive={orb.color}
        emissiveIntensity={hovered ? 0.9 : 0.4}
        roughness={0.2}
        metalness={0.8}
      />
      {hovered && (
        <Html distanceFactor={12} position={[0, orb.size + 0.3, 0]} center>
          <div className="px-2.5 py-1 rounded-lg glass-panel bg-bg-2/95 border border-white/20 text-white font-mono text-[11px] whitespace-nowrap shadow-xl pointer-events-none select-none">
            {orb.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function FloatingParticles() {
  const count = 70;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 5;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#C4B5FD"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GalaxyScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    // Gentle mouse parallax
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.08 + pointer.x * 0.25;
    groupRef.current.rotation.x = 0.35 + pointer.y * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Central Luminescent Core */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.95, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#7C3AED"
            emissive="#4F46E5"
            emissiveIntensity={0.8}
            distort={0.35}
            speed={2}
            roughness={0.1}
          />
        </Sphere>
      </Float>

      {/* Orbit Rings */}
      {ORB_CONFIGS.map((orb) => (
        <mesh key={`ring-${orb.key}`} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[orb.radius - 0.015, orb.radius + 0.015, 64]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* 8 Orbiting Subject Orbs */}
      {ORB_CONFIGS.map((orb) => (
        <OrbitingOrb key={orb.key} orb={orb} />
      ))}

      {/* Ambient Star Particles */}
      <FloatingParticles />
    </group>
  );
}

export const KnowledgeGalaxy: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [webGlSupported, setWebGlSupported] = useState(true);

  // If user prefers reduced motion or WebGL is not available, render graceful CSS aurora fallback
  if (prefersReducedMotion || !webGlSupported) {
    return (
      <div className="relative w-full h-[450px] sm:h-[550px] flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 blur-3xl opacity-50 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-72 h-72 rounded-full border border-purple-500/20 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-cyan-500/20 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-purple-600/40 blur-md flex items-center justify-center font-display font-bold text-white text-lg">
                CSF
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 6, 12], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setWebGlSupported(true)}
        onError={() => setWebGlSupported(false)}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#C4B5FD" distance={15} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#22D3EE" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#EC4899" />
        <GalaxyScene />
      </Canvas>
    </div>
  );
};

export default KnowledgeGalaxy;
