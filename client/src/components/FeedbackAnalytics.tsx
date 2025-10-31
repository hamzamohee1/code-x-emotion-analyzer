import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface FeedbackAnalyticsProps {
  totalFeedback: number;
  correctedCount: number;
  accuracy: number;
  emotionAccuracy: Record<string, number>;
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
  Anger: '#ef4444',
  Disgust: '#22c55e',
  Fear: '#a855f7',
  Happiness: '#eab308',
  Neutral: '#6b7280',
  Sadness: '#3b82f6',
  Surprise: '#ec4899',
};

export function FeedbackAnalytics({
  totalFeedback,
  correctedCount,
  accuracy,
  emotionAccuracy,
}: FeedbackAnalyticsProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const data = Object.entries(emotionAccuracy).map(([emotion, acc]) => ({
      emotion,
      accuracy: Math.round(acc),
      emoji: emotionEmojis[emotion] || '😐',
    }));
    setChartData(data);
  }, [emotionAccuracy]);

  const pieData = [
    { name: 'Correct', value: totalFeedback - correctedCount, color: '#10b981' },
    { name: 'Corrected', value: correctedCount, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card-dark border-indigo-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Feedback</p>
                <p className="text-3xl font-bold text-white mt-2">{totalFeedback}</p>
              </div>
              <Zap className="w-8 h-8 text-indigo-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-dark border-indigo-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Corrections</p>
                <p className="text-3xl font-bold text-white mt-2">{correctedCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-dark border-indigo-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Model Accuracy</p>
                <p className="text-3xl font-bold text-white mt-2">{accuracy.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-dark border-indigo-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Correct Predictions</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {totalFeedback - correctedCount}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy by Emotion */}
        <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
          <CardHeader>
            <CardTitle>Accuracy by Emotion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="emoji" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #4f46e5',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="accuracy" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feedback Distribution */}
        <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
          <CardHeader>
            <CardTitle>Feedback Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #4f46e5',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Emotion Accuracy Table */}
      <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
        <CardHeader>
          <CardTitle>Detailed Emotion Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.emotion} className="flex items-center justify-between p-3 glass-card">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-white">{item.emotion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-2 rounded-full transition-all"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                  <p className="text-indigo-300 font-semibold w-12 text-right">
                    {item.accuracy}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="glass-card-dark border-indigo-500/30">
        <CardHeader>
          <CardTitle>Model Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="glass-card p-4 border-l-4 border-green-500">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-green-300">✓ Strong Performance:</span> Your model is performing well with {accuracy.toFixed(1)}% accuracy. Keep collecting feedback to improve further.
            </p>
          </div>

          <div className="glass-card p-4 border-l-4 border-indigo-500">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-indigo-300">📊 Sample Size:</span> You have {totalFeedback} feedback samples. Continue gathering more data to improve model robustness.
            </p>
          </div>

          <div className="glass-card p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-yellow-300">⚡ Next Steps:</span> Focus on emotions with lower accuracy scores. More diverse training data will help improve overall performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
