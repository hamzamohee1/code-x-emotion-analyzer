import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Mic, Square } from "lucide-react";
import { Button } from "./ui/button";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import { RealtimeFrequencyChart } from "./RealtimeFrequencyChart";
import { GuidedRecordingPrompts } from "./GuidedRecordingPrompts";

interface VoiceRecorder3DProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  isAnalyzing?: boolean;
  showPrompts?: boolean;
}

// 3D Animated Sphere Component
function AnimatedSphere({ isRecording, analyzerData }: { isRecording: boolean; analyzerData: any }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);

  useFrame(({ clock }) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;

      if (isRecording && analyzerData) {
        const { energy, bass, mid, treble } = analyzerData;
        
        // Scale based on energy
        const baseScale = 1 + energy * 0.3;
        const bassScale = (bass / 255) * 0.15;
        const midScale = (mid / 255) * 0.15;
        const trebleScale = (treble / 255) * 0.15;
        
        const totalScale = baseScale + bassScale + midScale + trebleScale;
        meshRef.current.scale.set(totalScale, totalScale, totalScale);
        
        // Color based on frequency distribution
        const hue = (bass / 255) * 0.1 + (mid / 255) * 0.2 + (treble / 255) * 0.3;
        materialRef.current.color.setHSL(hue % 1, 0.8, 0.5);
        materialRef.current.emissiveIntensity = 0.3 + energy * 0.5;
      } else if (isRecording) {
        const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.15 + 1;
        meshRef.current.scale.set(pulse, pulse, pulse);
        
        materialRef.current.emissive.setHSL(
          (clock.getElapsedTime() * 0.2) % 1,
          0.8,
          0.4
        );
      } else {
        meshRef.current.scale.set(1, 1, 1);
        materialRef.current.emissive.setHSL(0.6, 0.8, 0.3);
      }
    }
  });

  return (
    <Sphere args={[1, 64, 64]} ref={meshRef as any}>
      <meshPhongMaterial
        ref={materialRef as any}
        color={isRecording ? "#ff6b6b" : "#4f46e5"}
        emissive={isRecording ? "#ff6b6b" : "#4f46e5"}
        emissiveIntensity={isRecording ? 0.5 : 0.2}
        wireframe={false}
        shininess={100}
      />
    </Sphere>
  );
}

export function VoiceRecorder3D({
  onRecordingComplete,
  isAnalyzing = false,
  showPrompts = true,
}: VoiceRecorder3DProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Use audio analyzer hook
  const analyzerData = useAudioAnalyzer(isRecording ? streamRef.current : null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];
      setRecordingTime(0);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        onRecordingComplete(audioBlob, recordingTime);
        
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 10) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full">
      {/* 3D Canvas */}
      <div className="w-full max-w-2xl h-96 rounded-lg overflow-hidden glass-card-dark border-indigo-500/30 neon-glow-blue">
        <Canvas camera={{ position: [0, 0, 2.5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, 10]} intensity={0.5} />
          <AnimatedSphere isRecording={isRecording} analyzerData={analyzerData} />
          <OrbitControls autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>

      {/* Real-Time Frequency Chart */}
      {isRecording && (
        <div className="w-full max-w-2xl">
          <RealtimeFrequencyChart analyzerData={analyzerData} isRecording={isRecording} />
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex gap-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isAnalyzing}
            className="btn-3d gap-2 bg-indigo-600 hover:bg-indigo-700 text-white neon-glow-blue"
            size="lg"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="btn-3d gap-2 bg-red-600 hover:bg-red-700 text-white neon-glow-blue"
            size="lg"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </Button>
        )}
      </div>

      {/* Recording Timer */}
      {isRecording && (
        <div className="text-center">
          <div className="text-lg font-semibold text-indigo-300 animate-glow-pulse">
            Recording: {recordingTime}s / 10s
          </div>
          <div className="mt-2 w-48 bg-black/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-2 rounded-full transition-all"
              style={{ width: `${(recordingTime / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Guided Recording Prompts */}
      {showPrompts && (
        <div className="w-full max-w-2xl">
          <GuidedRecordingPrompts isRecording={isRecording} recordingTime={recordingTime} />
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <p className="mt-2 text-indigo-300 font-medium animate-glow-pulse">Analyzing emotion...</p>
        </div>
      )}
    </div>
  );
}
