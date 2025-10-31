import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmotionRecord {
  id: string;
  emotion: string;
  confidence: number;
  timestamp: Date;
  emotionScores: Record<string, number>;
  duration: number;
}

interface EmotionComparisonProps {
  records: EmotionRecord[];
  onRemove: (id: string) => void;
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

const emotionColors: Record<string, string> = {
  Anger: 'from-red-600 to-red-400',
  Disgust: 'from-green-600 to-green-400',
  Fear: 'from-purple-600 to-purple-400',
  Happiness: 'from-yellow-600 to-yellow-400',
  Neutral: 'from-gray-600 to-gray-400',
  Sadness: 'from-blue-600 to-blue-400',
  Surprise: 'from-pink-600 to-pink-400',
};

export function EmotionComparison({ records, onRemove }: EmotionComparisonProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

  if (records.length === 0) {
    return (
      <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
        <CardHeader>
          <CardTitle>Emotion Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-8">
            No emotion records yet. Record some voice samples to compare them.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
      <CardHeader>
        <CardTitle>Emotion Comparison</CardTitle>
        <p className="text-sm text-slate-400 mt-2">
          Compare your emotion records side-by-side
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Records List */}
        <div className="space-y-3">
          {records.map((record, index) => (
            <div
              key={record.id}
              className="glass-card p-4 flex items-center justify-between hover:border-indigo-400/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-3xl">
                  {emotionEmojis[record.emotion] || '😐'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {record.emotion}
                  </p>
                  <p className="text-sm text-slate-400">
                    {record.timestamp.toLocaleString()} • {record.duration}s
                  </p>
                  <div className="mt-2 w-full bg-black/30 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${record.confidence}%` }}
                    />
                  </div>
                  <p className="text-xs text-indigo-300 mt-1">
                    Confidence: {record.confidence}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemove(record.id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Chart */}
        {records.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-300">
              Emotion Distribution
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {['Anger', 'Disgust', 'Fear', 'Happiness', 'Neutral', 'Sadness', 'Surprise'].map(
                (emotion) => {
                  const avgScore =
                    records.reduce(
                      (sum, record) =>
                        sum + (record.emotionScores[emotion] || 0),
                      0
                    ) / records.length;

                  return (
                    <div key={emotion} className="flex flex-col items-center gap-2">
                      <div className="text-2xl">
                        {emotionEmojis[emotion]}
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-32 flex items-end justify-center p-2">
                        <div
                          className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t transition-all"
                          style={{
                            height: `${avgScore * 100}%`,
                            minHeight: avgScore > 0 ? '4px' : '0',
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 text-center">
                        {(avgScore * 100).toFixed(0)}%
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Statistics */}
        {records.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">
                {records.length}
              </p>
              <p className="text-xs text-slate-400">Total Records</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">
                {(
                  records.reduce((sum, r) => sum + r.confidence, 0) /
                  records.length
                ).toFixed(0)}
                %
              </p>
              <p className="text-xs text-slate-400">Avg Confidence</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">
                {records.reduce((max, r) => Math.max(max, r.confidence), 0)}%
              </p>
              <p className="text-xs text-slate-400">Peak Confidence</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
