import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { AudioAnalyzerData } from '@/hooks/useAudioAnalyzer';

interface RealtimeAudioSphereProps {
  analyzerData: AudioAnalyzerData | null;
  isRecording: boolean;
}

function AudioResponsiveSphere({
  analyzerData,
}: {
  analyzerData: AudioAnalyzerData | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);
  const geometryRef = useRef<THREE.IcosahedronGeometry>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = clock.getElapsedTime();

    // Base rotation
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;

    if (analyzerData) {
      const { energy, bass, mid, treble, frequencies } = analyzerData;

      // Scale based on energy
      const baseScale = 1 + energy * 0.3;
      const bassScale = (bass / 255) * 0.2;
      const midScale = (mid / 255) * 0.2;
      const trebleScale = (treble / 255) * 0.2;

      const totalScale = baseScale + bassScale + midScale + trebleScale;
      meshRef.current.scale.set(totalScale, totalScale, totalScale);

      // Color based on frequency distribution
      const hue = (bass / 255) * 0.1 + (mid / 255) * 0.2 + (treble / 255) * 0.3;
      materialRef.current.color.setHSL(hue % 1, 0.8, 0.5);

      // Emissive intensity based on energy
      materialRef.current.emissiveIntensity = 0.3 + energy * 0.5;

      // Rotation speed based on energy
      meshRef.current.rotation.x += (energy * 0.01);
      meshRef.current.rotation.y += (energy * 0.015);

      // Distort geometry based on frequencies
      if (geometryRef.current && frequencies) {
        const positionAttribute = geometryRef.current.getAttribute('position');
        const positionArray = positionAttribute.array as Float32Array;

        const originalPositions = new Float32Array(positionArray);

        for (let i = 0; i < positionArray.length; i += 3) {
          const index = Math.floor((i / 3) % frequencies.length);
          const frequency = frequencies[index] / 255;

          // Get original position
          const x = originalPositions[i];
          const y = originalPositions[i + 1];
          const z = originalPositions[i + 2];

          // Calculate distance from center
          const distance = Math.sqrt(x * x + y * y + z * z);

          // Apply frequency-based distortion
          const distortion = 1 + frequency * 0.3;

          positionArray[i] = (x / distance) * distance * distortion;
          positionArray[i + 1] = (y / distance) * distance * distortion;
          positionArray[i + 2] = (z / distance) * distance * distortion;
        }

        positionAttribute.needsUpdate = true;
      }
    }
  });

  return (
    <Sphere args={[1, 32, 32]} ref={meshRef}>
      <icosahedronGeometry ref={geometryRef} args={[1, 4]} />
      <meshPhongMaterial
        ref={materialRef}
        color="#6366f1"
        emissive="#4f46e5"
        emissiveIntensity={0.3}
        wireframe={false}
        shininess={100}
      />
    </Sphere>
  );
}

export function RealtimeAudioSphere({
  analyzerData,
  isRecording,
}: RealtimeAudioSphereProps) {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden glass-card-dark border-indigo-500/30 neon-glow-blue">
      {isRecording && (
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight position={[-10, -10, 10]} intensity={0.8} color="#6366f1" />
          <pointLight position={[0, 0, 5]} intensity={0.6} />

          <AudioResponsiveSphere analyzerData={analyzerData} />

          <OrbitControls
            autoRotate
            autoRotateSpeed={1}
            enableZoom={false}
            enablePan={false}
          />
        </Canvas>
      )}
      {!isRecording && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900/50 to-black/50">
          <p className="text-slate-400 text-center">
            Start recording to see real-time audio visualization
          </p>
        </div>
      )}
    </div>
  );
}
