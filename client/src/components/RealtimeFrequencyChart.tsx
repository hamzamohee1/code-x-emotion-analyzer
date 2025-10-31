import React, { useEffect, useRef } from 'react';
import type { AudioAnalyzerData } from '@/hooks/useAudioAnalyzer';

interface RealtimeFrequencyChartProps {
  analyzerData: AudioAnalyzerData | null;
  isRecording: boolean;
}

export function RealtimeFrequencyChart({
  analyzerData,
  isRecording,
}: RealtimeFrequencyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawChart = () => {
      if (!analyzerData) {
        animationFrameRef.current = requestAnimationFrame(drawChart);
        return;
      }

      const { frequencies, waveform, bass, mid, treble, energy } = analyzerData;

      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars
      const barWidth = canvas.width / frequencies.length;
      const centerY = canvas.height / 2;

      // Create gradient for frequency bars
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(0.5, '#8b5cf6');
      gradient.addColorStop(1, '#ec4899');

      ctx.fillStyle = gradient;

      for (let i = 0; i < frequencies.length; i += 4) {
        const barHeight = (frequencies[i] / 255) * (canvas.height / 2);
        ctx.fillRect(
          i * barWidth,
          centerY - barHeight,
          barWidth - 1,
          barHeight
        );
      }

      // Draw waveform
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const waveformScale = canvas.height / 512;
      for (let i = 0; i < waveform.length; i += 4) {
        const x = (i / waveform.length) * canvas.width;
        const y = centerY + ((waveform[i] - 128) / 128) * (canvas.height / 3);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw frequency band indicators
      const bandHeight = 20;
      const bandY = canvas.height - bandHeight - 10;

      // Bass band
      ctx.fillStyle = `rgba(239, 68, 68, ${Math.min(bass / 255, 1)})`;
      ctx.fillRect(10, bandY, 40, bandHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.fillText('Bass', 15, bandY + 15);

      // Mid band
      ctx.fillStyle = `rgba(34, 197, 94, ${Math.min(mid / 255, 1)})`;
      ctx.fillRect(60, bandY, 40, bandHeight);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Mid', 70, bandY + 15);

      // Treble band
      ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(treble / 255, 1)})`;
      ctx.fillRect(110, bandY, 40, bandHeight);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Treble', 115, bandY + 15);

      // Energy meter
      ctx.fillStyle = `rgba(168, 85, 247, ${Math.min(energy, 1)})`;
      const energyWidth = (energy / 1) * 100;
      ctx.fillRect(canvas.width - 110, bandY, energyWidth, bandHeight);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.strokeRect(canvas.width - 110, bandY, 100, bandHeight);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Energy', canvas.width - 105, bandY + 15);

      animationFrameRef.current = requestAnimationFrame(drawChart);
    };

    drawChart();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyzerData, isRecording]);

  return (
    <div className="w-full space-y-4">
      <div className="glass-card-dark p-4 rounded-lg border-indigo-500/30 neon-glow-blue">
        <h3 className="text-sm font-semibold text-indigo-300 mb-3">Real-Time Frequency Analysis</h3>
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full rounded-lg bg-black/50"
        />
      </div>
    </div>
  );
}
