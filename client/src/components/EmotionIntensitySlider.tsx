import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmotionIntensitySliderProps {
  emotion: string;
  initialConfidence: number;
  emotionScores: Record<string, number>;
  onConfirm: (adjustedConfidence: number, adjustedScores: Record<string, number>) => void;
  onCancel: () => void;
}

const emotionEmojis: Record<string, string> = {
  Anger: '😠',
  Disgust: '🤢',
  Fear: '😨',
  Happiness: '😊',
  Neutral: '😐',
  Sadness: '😢',
  Surprise: '😮',
};

const intensityLabels = [
  'Very Subtle',
  'Subtle',
  'Moderate',
  'Strong',
  'Very Strong',
];

export function EmotionIntensitySlider({
  emotion,
  initialConfidence,
  emotionScores,
  onConfirm,
  onCancel,
}: EmotionIntensitySliderProps) {
  const [intensity, setIntensity] = useState(initialConfidence);
  const [adjustedScores, setAdjustedScores] = useState(emotionScores);

  const handleIntensityChange = (value: number) => {
    setIntensity(value);

    // Adjust all emotion scores based on the new intensity
    const adjustmentFactor = value / initialConfidence;
    const newScores = { ...emotionScores };

    // Boost the primary emotion
    newScores[emotion] = Math.min(newScores[emotion] * adjustmentFactor, 1);

    // Reduce other emotions proportionally
    const totalOthers = Object.entries(newScores)
      .filter(([key]) => key !== emotion)
      .reduce((sum, [, val]) => sum + val, 0);

    if (totalOthers > 0) {
      const reduction = 1 - newScores[emotion];
      for (const key in newScores) {
        if (key !== emotion) {
          newScores[key] = (newScores[key] / totalOthers) * reduction;
        }
      }
    }

    setAdjustedScores(newScores);
  };

  const intensityLevel = Math.round((intensity / 100) * 4);
  const intensityLabel = intensityLabels[intensityLevel] || 'Unknown';

  return (
    <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-4xl">{emotionEmojis[emotion] || '😐'}</span>
          <div>
            <p>Adjust Emotion Intensity</p>
            <p className="text-sm font-normal text-slate-400 mt-1">
              Fine-tune the confidence level for {emotion}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Intensity Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-indigo-300">Intensity Level</p>
            <p className="text-2xl font-bold text-indigo-400">{intensity}%</p>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => handleIntensityChange(Number(e.target.value))}
            className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-xs text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

          {/* Intensity Label */}
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-slate-400">Intensity Description</p>
            <p className="text-lg font-semibold text-indigo-300 mt-2">
              {intensityLabel}
            </p>
          </div>
        </div>

        {/* Emotion Score Preview */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-indigo-300">Adjusted Emotion Scores</p>
          {Object.entries(adjustedScores).map(([emotionName, score]) => (
            <div key={emotionName} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{emotionName}</span>
                <span className="text-indigo-400 font-semibold">
                  {(score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-2 rounded-full transition-all"
                  style={{ width: `${score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onConfirm(intensity, adjustedScores)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white neon-glow-blue"
          >
            Confirm Adjustment
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
          >
            Cancel
          </Button>
        </div>

        {/* Info Message */}
        <div className="glass-card p-3 border-l-2 border-indigo-500">
          <p className="text-xs text-slate-300">
            💡 Adjust the intensity slider to refine the AI's prediction. This helps improve accuracy for future analyses.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
