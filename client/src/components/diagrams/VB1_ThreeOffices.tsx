import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Html, Sphere, Box } from '@react-three/drei';
import { Box as BoxIcon, Database, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

function ThreeDScene({ mode }: { mode: 'files' | 'dbms' }) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#C4B5FD" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#22D3EE" />

      {mode === 'files' ? (
        <group>
          {/* 3 Separate Floating Cubes */}
          <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
            <Box position={[-2.5, 0.5, 0]} args={[1, 1, 1]}>
              <meshStandardMaterial color="#FB7185" roughness={0.3} metalness={0.2} />
              <Html distanceFactor={10} position={[0, -0.9, 0]} center>
                <span className="text-[10px] font-mono text-rose-300 whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded">
                  reg.txt
                </span>
              </Html>
            </Box>
          </Float>

          <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
            <Box position={[0, -0.8, 0]} args={[1, 1, 1]}>
              <meshStandardMaterial color="#FBBF24" roughness={0.3} metalness={0.2} />
              <Html distanceFactor={10} position={[0, -0.9, 0]} center>
                <span className="text-[10px] font-mono text-amber-300 whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded">
                  hostel.txt
                </span>
              </Html>
            </Box>
          </Float>

          <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.6}>
            <Box position={[2.5, 0.5, 0]} args={[1, 1, 1]}>
              <meshStandardMaterial color="#38BDF8" roughness={0.3} metalness={0.2} />
              <Html distanceFactor={10} position={[0, -0.9, 0]} center>
                <span className="text-[10px] font-mono text-cyan-300 whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded">
                  library.txt
                </span>
              </Html>
            </Box>
          </Float>
        </group>
      ) : (
        <group>
          {/* Central Glowing Unified DBMS Core */}
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere position={[0, 0, 0]} args={[1.3, 32, 32]}>
              <meshStandardMaterial
                color="#7C3AED"
                emissive="#4F46E5"
                emissiveIntensity={0.8}
                roughness={0.1}
                metalness={0.5}
              />
              <Html distanceFactor={10} position={[0, -1.8, 0]} center>
                <div className="text-center bg-black/80 p-2 rounded-xl border border-purple-500/40">
                  <span className="text-xs font-mono font-bold text-white block">Central DBMS Core</span>
                  <span className="text-[10px] text-cyan-300 font-mono">Catalog + Query Processor</span>
                </div>
              </Html>
            </Sphere>
          </Float>
        </group>
      )}
    </Canvas>
  );
}

export const VB1_ThreeOffices: React.FC = () => {
  const [is3D, setIs3D] = useState(false);
  const [dbmsMode, setDbmsMode] = useState<'files' | 'dbms'>('files');

  return (
    <div className="rounded-2xl glass-panel p-5 sm:p-6 border border-surface-border my-8 space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider block">
            Visual Register: VB-1
          </span>
          <h4 className="font-display font-bold text-base text-white">
            Three Offices, Three Private Files vs. Unified DBMS
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {is3D && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDbmsMode(dbmsMode === 'files' ? 'dbms' : 'files')}
              className="text-xs"
            >
              {dbmsMode === 'files' ? 'Switch to DBMS' : 'Switch to Files'}
            </Button>
          )}

          <Button
            variant={is3D ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIs3D(!is3D)}
            icon={<Eye className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {is3D ? 'View 2D SVG' : 'View in 3D'}
          </Button>
        </div>
      </div>

      {/* Main Visual Display */}
      {is3D ? (
        <div className="w-full h-80 rounded-xl bg-bg-0/80 border border-surface-border relative overflow-hidden">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs text-[#A9B1D6]">Loading 3D scene...</div>}>
            <ThreeDScene mode={dbmsMode} />
          </Suspense>
        </div>
      ) : (
        /* 2D SVG Diagram */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-bg-0/60 border border-surface-border/60">
          {/* Left: Traditional File System */}
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-3">
            <span className="text-xs font-mono text-rose-400 font-semibold block">
              1. File System Architecture
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-black/40 border border-rose-500/20 flex items-center justify-between">
                <span className="text-white">Registrar App</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-300 font-bold">registrar.txt</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-rose-500/20 flex items-center justify-between">
                <span className="text-white">Hostel App</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-300 font-bold">hostel.txt</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-rose-500/20 flex items-center justify-between">
                <span className="text-white">Library App</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-300 font-bold">library.txt</span>
              </div>
            </div>
            <div className="text-[11px] text-rose-300/80 pt-1">
              &bull; Isolated data silos &bull; Unsynchronized schemas &bull; Redundancy
            </div>
          </div>

          {/* Right: Unified DBMS */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
            <span className="text-xs font-mono text-emerald-400 font-semibold block">
              2. Unified DBMS Architecture
            </span>
            <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/30 text-center space-y-2">
              <div className="flex justify-around text-xs font-mono text-white">
                <span>Registrar</span>
                <span>Hostel</span>
                <span>Library</span>
              </div>
              <div className="text-emerald-400 font-mono text-xs">&darr; All Queries Routed Into &darr;</div>
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-200">
                Central DBMS (Query Engine + Catalog + Concurrency Control)
              </div>
              <div className="text-xs font-mono text-cyan-300 pt-1">
                &darr; Managed Storage &darr;<br />
                <strong>Single Shared Database Store</strong>
              </div>
            </div>
            <div className="text-[11px] text-emerald-300/80 pt-1">
              &bull; Zero duplicate data &bull; Single source of truth &bull; ACID guarantees
            </div>
          </div>
        </div>
      )}

      {/* "What to notice" List */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-surface-border text-xs text-[#A9B1D6] space-y-1.5">
        <span className="font-mono text-purple-300 font-semibold uppercase tracking-wider block text-[11px]">
          What to Notice in Technical Interviews:
        </span>
        <div>&bull; In the file system, each program hard-codes file offsets and data formats into application code (program-data dependency).</div>
        <div>&bull; In DBMS, the catalog isolates internal file layout from application queries (data independence).</div>
      </div>
    </div>
  );
};
