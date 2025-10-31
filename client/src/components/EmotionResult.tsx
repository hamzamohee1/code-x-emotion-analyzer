import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Emotion3DVisualization } from "./Emotion3DVisualization";

interface EmotionScores {
  [key: string]: number;
}

interface EmotionResultProps {
  emotion: string;
  confidence: number;
  emotionScores: EmotionScores;
  duration: number;
}

const EMOTION_COLORS: Record<string, string> = {
  Anger: "from-red-500 to-red-600",
  Disgust: "from-green-500 to-green-600",
  Fear: "from-purple-500 to-purple-600",
  Happiness: "from-yellow-500 to-yellow-600",
  Neutral: "from-gray-500 to-gray-600",
  Sadness: "from-blue-500 to-blue-600",
  Surprise: "from-pink-500 to-pink-600",
};

const EMOTION_EMOJIS: Record<string, string> = {
  Anger: "😠",
  Disgust: "🤢",
  Fear: "😨",
  Happiness: "😊",
  Neutral: "😐",
  Sadness: "😢",
  Surprise: "😲",
};

export function EmotionResult({
  emotion,
  confidence,
  emotionScores,
  duration,
}: EmotionResultProps) {
  const sortedEmotions = Object.entries(emotionScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7);

  const gradientClass = EMOTION_COLORS[emotion] || "from-indigo-500 to-indigo-600";
  const emoji = EMOTION_EMOJIS[emotion] || "🎤";

  return (
    <div className="space-y-6 w-full max-w-2xl">
      {/* 3D Emotion Visualization */}
      <div className="flex justify-center">
        <Emotion3DVisualization emotion={emotion} confidence={confidence} />
      </div>

      {/* Main Result Card */}
      <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Emotion Detected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Large Emotion Display */}
          <div className={`bg-gradient-to-r ${gradientClass} rounded-lg p-8 text-center text-white neon-glow-blue`}>
            <div className="text-6xl mb-4">{emoji}</div>
            <div className="text-4xl font-bold mb-2">{emotion}</div>
            <div className="text-xl opacity-90">Confidence: {confidence}%</div>
          </div>

          {/* Recording Duration */}
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-slate-400">Recording Duration</p>
            <p className="text-2xl font-semibold text-indigo-400">{duration}s</p>
          </div>
        </CardContent>
      </Card>

      {/* Emotion Breakdown */}
      <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
        <CardHeader>
          <CardTitle>Emotion Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedEmotions.map(([emotionName, score]) => (
            <div key={emotionName} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-200">{emotionName}</span>
                <span className="text-indigo-400 font-semibold">
                  {Math.round(score * 100)}%
                </span>
              </div>
              <Progress
                value={Math.round(score * 100)}
                className="h-2 bg-slate-700"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emotion Description */}
      <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
        <CardHeader>
          <CardTitle>About This Emotion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 leading-relaxed">
            {getEmotionDescription(emotion)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function getEmotionDescription(emotion: string): string {
  const descriptions: Record<string, string> = {
    Anger:
      "Anger is a strong feeling of displeasure and hostility. It often arises in response to perceived injustice or frustration. Your voice shows signs of heightened intensity and tension.",
    Disgust:
      "Disgust is a feeling of revulsion or strong disapproval. It can be triggered by something unpleasant or morally offensive. Your vocal patterns indicate rejection or disapproval.",
    Fear:
      "Fear is an emotional response to perceived threat or danger. It often involves anxiety and worry. Your voice shows signs of tension and caution.",
    Happiness:
      "Happiness is a state of joy and contentment. It reflects positive emotions and satisfaction. Your voice carries warmth, enthusiasm, and positive energy.",
    Neutral:
      "Neutral emotion indicates a calm, balanced state without strong emotional coloring. Your voice maintains a steady, measured tone without significant emotional expression.",
    Sadness:
      "Sadness is a feeling of sorrow or unhappiness. It often involves a sense of loss or disappointment. Your voice carries a softer, more subdued quality.",
    Surprise:
      "Surprise is a sudden emotional reaction to something unexpected. It can be positive or negative. Your voice shows signs of spontaneity and heightened alertness.",
  };

  return descriptions[emotion] || "Unable to determine emotion characteristics.";
}
