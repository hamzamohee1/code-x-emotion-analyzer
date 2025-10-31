import { useEffect, useRef, useState } from 'react';

export interface AudioAnalyzerData {
  frequencies: Uint8Array;
  waveform: Uint8Array;
  averageFrequency: number;
  peakFrequency: number;
  energy: number;
  bass: number;
  mid: number;
  treble: number;
}

export function useAudioAnalyzer(stream: MediaStream | null) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [analyzerData, setAnalyzerData] = useState<AudioAnalyzerData | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!stream) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    try {
      // Initialize audio context
      const audioContext = new (window as any).AudioContext();
      audioContextRef.current = audioContext;

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      // Create source from stream
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Connect source to analyser
      source.connect(analyser);

      // Create frequency and waveform data arrays
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      const waveformData = new Uint8Array(analyser.frequencyBinCount);

      // Animation loop for real-time analysis
      const analyze = () => {
        analyser.getByteFrequencyData(frequencyData);
        analyser.getByteTimeDomainData(waveformData);

        // Calculate frequency metrics
        let sum = 0;
        let maxFreq = 0;
        let maxFreqIndex = 0;

        for (let i = 0; i < frequencyData.length; i++) {
          sum += frequencyData[i];
          if (frequencyData[i] > maxFreq) {
            maxFreq = frequencyData[i];
            maxFreqIndex = i;
          }
        }

        const averageFrequency = sum / frequencyData.length;
        const peakFrequency = (maxFreqIndex * audioContext.sampleRate) / analyser.fftSize;

        // Calculate energy in different frequency bands
        const bassEnd = Math.floor(frequencyData.length * 0.1);
        const midEnd = Math.floor(frequencyData.length * 0.5);
        const trebleEnd = frequencyData.length;

        let bassEnergy = 0;
        let midEnergy = 0;
        let trebleEnergy = 0;

        for (let i = 0; i < bassEnd; i++) {
          bassEnergy += frequencyData[i];
        }
        for (let i = bassEnd; i < midEnd; i++) {
          midEnergy += frequencyData[i];
        }
        for (let i = midEnd; i < trebleEnd; i++) {
          trebleEnergy += frequencyData[i];
        }

        bassEnergy /= bassEnd;
        midEnergy /= (midEnd - bassEnd);
        trebleEnergy /= (trebleEnd - midEnd);

        // Calculate overall energy
        let totalEnergy = 0;
        for (let i = 0; i < waveformData.length; i++) {
          const normalized = (waveformData[i] - 128) / 128;
          totalEnergy += normalized * normalized;
        }
        totalEnergy = Math.sqrt(totalEnergy / waveformData.length);

        setAnalyzerData({
          frequencies: new Uint8Array(frequencyData),
          waveform: new Uint8Array(waveformData),
          averageFrequency,
          peakFrequency,
          energy: totalEnergy,
          bass: bassEnergy,
          mid: midEnergy,
          treble: trebleEnergy,
        });

        animationFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (error) {
      console.error('Error initializing audio analyzer:', error);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stream]);

  return analyzerData;
}
