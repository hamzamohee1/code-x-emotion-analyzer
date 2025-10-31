import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { VoiceRecorder3D } from "@/components/VoiceRecorder3D";
import { EmotionResult } from "@/components/EmotionResult";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AnalysisResult {
  emotion: string;
  confidence: number;
  emotionScores: Record<string, number>;
  duration: number;
}

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    if (!user) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Upload audio to S3
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      // For now, we'll create a mock analysis result
      // In production, you would upload to S3 and call the backend API
      const mockEmotionScores: Record<string, number> = {
        Anger: Math.random(),
        Disgust: Math.random(),
        Fear: Math.random(),
        Happiness: Math.random(),
        Neutral: Math.random(),
        Sadness: Math.random(),
        Surprise: Math.random(),
      };

      // Normalize scores
      const total = Object.values(mockEmotionScores).reduce((a, b) => a + b, 0);
      Object.keys(mockEmotionScores).forEach((key) => {
        mockEmotionScores[key] = mockEmotionScores[key] / total;
      });

      // Get the emotion with highest score
      const [emotion, confidence] = Object.entries(mockEmotionScores).reduce(
        (max, current) => (current[1] > max[1] ? current : max),
        ["Neutral", 0]
      );

      const result: AnalysisResult = {
        emotion,
        confidence: Math.round((confidence as number) * 100),
        emotionScores: mockEmotionScores,
        duration,
      };

      // Save to database (would normally call the mutation here)
      // For now, we'll just display the result
      // await trpc.emotion.analyze.useMutation() would be used in a proper component

      setAnalysisResult(result);
    } catch (err) {
      console.error("Error analyzing emotion:", err);
      setError("Failed to analyze emotion. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-4">
            Voice Emotion Analyzer
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Discover your emotions through voice analysis. Record a message and let our AI
            detect your emotional state using advanced deep learning.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            Sign In to Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Voice Emotion Analyzer
          </h1>
          <p className="text-lg text-slate-300">
            Record your voice and discover your emotional state
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Recorder Section */}
          {!analysisResult ? (
            <div className="w-full lg:w-1/2 flex justify-center">
              <VoiceRecorder3D
                onRecordingComplete={handleRecordingComplete}
                isAnalyzing={isAnalyzing}
              />
            </div>
          ) : (
            <div className="w-full lg:w-1/2 flex justify-center">
              <EmotionResult
                emotion={analysisResult.emotion}
                confidence={analysisResult.confidence}
                emotionScores={analysisResult.emotionScores}
                duration={analysisResult.duration}
              />
            </div>
          )}

          {/* Info Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
              <ol className="space-y-4 text-slate-300">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </span>
                  <span>Click "Start Recording" to begin capturing your voice</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </span>
                  <span>Speak naturally for up to 10 seconds</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </span>
                  <span>Click "Stop Recording" when done</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </span>
                  <span>Our AI analyzes your voice and displays your emotion</span>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Emotions Detected</h2>
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😠</span>
                  <span>Anger</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤢</span>
                  <span>Disgust</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😨</span>
                  <span>Fear</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😊</span>
                  <span>Happiness</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😐</span>
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😢</span>
                  <span>Sadness</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😲</span>
                  <span>Surprise</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-300">
                {error}
              </div>
            )}

            {analysisResult && (
              <Button
                onClick={() => {
                  setAnalysisResult(null);
                  setError(null);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Analyze Another Recording
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
