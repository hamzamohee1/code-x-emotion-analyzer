import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Icosahedron, Octahedron, Torus } from "@react-three/drei";
import * as THREE from "three";

interface Emotion3DVisualizationProps {
  emotion: string;
  confidence: number;
}

// Emotion configuration with colors, shapes, and animations
const EMOTION_CONFIG: Record<
  string,
  {
    primaryColor: string;
    secondaryColor: string;
    emissiveColor: string;
    shape: "sphere" | "icosahedron" | "octahedron" | "torus";
    scale: number;
    rotationSpeed: number;
    pulseIntensity: number;
    particleColor: string;
  }
> = {
  Anger: {
    primaryColor: "#ff3333",
    secondaryColor: "#ff6b6b",
    emissiveColor: "#ff0000",
    shape: "icosahedron",
    scale: 1.2,
    rotationSpeed: 0.02,
    pulseIntensity: 0.3,
    particleColor: "#ff3333",
  },
  Disgust: {
    primaryColor: "#22c55e",
    secondaryColor: "#4ade80",
    emissiveColor: "#16a34a",
    shape: "octahedron",
    scale: 1.15,
    rotationSpeed: 0.015,
    pulseIntensity: 0.25,
    particleColor: "#22c55e",
  },
  Fear: {
    primaryColor: "#a855f7",
    secondaryColor: "#d8b4fe",
    emissiveColor: "#9333ea",
    shape: "icosahedron",
    scale: 1.3,
    rotationSpeed: 0.025,
    pulseIntensity: 0.35,
    particleColor: "#a855f7",
  },
  Happiness: {
    primaryColor: "#fbbf24",
    secondaryColor: "#fcd34d",
    emissiveColor: "#f59e0b",
    shape: "sphere",
    scale: 1.25,
    rotationSpeed: 0.01,
    pulseIntensity: 0.2,
    particleColor: "#fbbf24",
  },
  Neutral: {
    primaryColor: "#6b7280",
    secondaryColor: "#9ca3af",
    emissiveColor: "#4b5563",
    shape: "sphere",
    scale: 1.0,
    rotationSpeed: 0.005,
    pulseIntensity: 0.1,
    particleColor: "#6b7280",
  },
  Sadness: {
    primaryColor: "#3b82f6",
    secondaryColor: "#60a5fa",
    emissiveColor: "#1d4ed8",
    shape: "torus",
    scale: 1.2,
    rotationSpeed: 0.008,
    pulseIntensity: 0.15,
    particleColor: "#3b82f6",
  },
  Surprise: {
    primaryColor: "#ec4899",
    secondaryColor: "#f472b6",
    emissiveColor: "#db2777",
    shape: "sphere",
    scale: 1.35,
    rotationSpeed: 0.03,
    pulseIntensity: 0.4,
    particleColor: "#ec4899",
  },
};

// Main emotion shape component
function EmotionShape({ emotion, confidence }: Emotion3DVisualizationProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);
  const config = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.Neutral;

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = clock.getElapsedTime();

    // Rotation based on emotion
    meshRef.current.rotation.x += config.rotationSpeed;
    meshRef.current.rotation.y += config.rotationSpeed * 1.5;
    meshRef.current.rotation.z += config.rotationSpeed * 0.5;

    // Pulse animation based on confidence
    const pulse =
      Math.sin(time * 2) * (config.pulseIntensity * (confidence / 100)) + 1;
    meshRef.current.scale.set(
      config.scale * pulse,
      config.scale * pulse,
      config.scale * pulse
    );

    // Dynamic emissive intensity
    const emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.2;
    materialRef.current.emissiveIntensity = emissiveIntensity;

    // Color shift based on confidence
    const hue = (confidence / 100) * 0.1;
    materialRef.current.color.setHSL(
      (parseInt(config.primaryColor.slice(1), 16) / 0xffffff) * 0.1 + hue,
      0.8,
      0.5
    );
  });

  const ShapeComponent = {
    sphere: Sphere,
    icosahedron: Icosahedron,
    octahedron: Octahedron,
    torus: Torus,
  }[config.shape];

  const shapeArgs =
    config.shape === "torus"
      ? [1, 0.4, 16, 100]
      : config.shape === "sphere"
        ? [1, 64, 64]
        : [1, 4];

  return (
    <ShapeComponent args={shapeArgs as any} ref={meshRef}>
      <meshPhongMaterial
        ref={materialRef}
        color={config.primaryColor}
        emissive={config.emissiveColor}
        emissiveIntensity={0.3}
        wireframe={false}
        shininess={100}
      />
    </ShapeComponent>
  );
}

// Particle system for emotion effects
function ParticleSystem({ emotion, confidence }: Emotion3DVisualizationProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const config = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.Neutral;
  const particleCount = Math.round(50 + (confidence / 100) * 100);

  useEffect(() => {
    if (!particlesRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 4;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.userData.velocities = velocities;

    const material = new THREE.PointsMaterial({
      color: config.particleColor,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    particlesRef.current.geometry = geometry;
    particlesRef.current.material = material;
  }, [emotion, confidence, particleCount]);

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position
      .array as Float32Array;
    const velocities = particlesRef.current.geometry.userData.velocities as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Wrap around
      if (Math.abs(positions[i]) > 2) velocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 2) velocities[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 2) velocities[i + 2] *= -1;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={particlesRef} />;
}

// Aura ring around the shape
function EmotionAura({ emotion }: { emotion: string }) {
  const torusRef = useRef<THREE.Mesh>(null);
  const config = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.Neutral;

  useFrame(({ clock }) => {
    if (!torusRef.current) return;

    torusRef.current.rotation.x += 0.001;
    torusRef.current.rotation.y += 0.003;

    const scale = 1.8 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    torusRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Torus args={[1.5, 0.1, 16, 100]} ref={torusRef}>
      <meshPhongMaterial
        color={config.secondaryColor}
        emissive={config.emissiveColor}
        emissiveIntensity={0.2}
        transparent
        opacity={0.4}
      />
    </Torus>
  );
}

export function Emotion3DVisualization({
  emotion,
  confidence,
}: Emotion3DVisualizationProps) {
  return (
    <div className="w-full max-w-2xl h-96 rounded-lg overflow-hidden border-2 border-indigo-300 bg-gradient-to-b from-slate-900 to-slate-800">
      <Canvas camera={{ position: [0, 0, 3.5] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, 10]} intensity={0.8} color="#6366f1" />
        <pointLight position={[0, 0, 5]} intensity={0.6} />

        <EmotionAura emotion={emotion} />
        <EmotionShape emotion={emotion} confidence={confidence} />
        <ParticleSystem emotion={emotion} confidence={confidence} />

        <OrbitControls
          autoRotate
          autoRotateSpeed={1}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
