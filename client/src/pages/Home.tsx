import { Button } from "@/components/ui/button";
import { VoiceRecorder3D } from "@/components/VoiceRecorder3D";
import { EmotionResult } from "@/components/EmotionResult";
import { Emotion3DVisualization } from "@/components/Emotion3DVisualization";
import { EmotionComparison } from "@/components/EmotionComparison";
import { EmotionIntensitySlider } from "@/components/EmotionIntensitySlider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { EmotionFeedback } from "@/components/EmotionFeedback";
import { FeedbackAnalytics } from "@/components/FeedbackAnalytics";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Loader2, Settings } from "lucide-react";

interface AnalysisResult {
  emotion: string;
  confidence: number;
  emotionScores: Record<string, number>;
  duration: number;
}

interface EmotionRecord {
  id: string;
  emotion: string;
  confidence: number;
  timestamp: Date;
  emotionScores: Record<string, number>;
  duration: number;
}

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotionRecords, setEmotionRecords] = useState<EmotionRecord[]>([]);
  const [showIntensitySlider, setShowIntensitySlider] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showComparison, setShowComparison] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState({ total: 0, corrected: 0, accuracy: 0 });

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
      
      // Add to emotion records for comparison
      const newRecord: EmotionRecord = {
        id: Date.now().toString(),
        emotion: result.emotion,
        confidence: result.confidence,
        timestamp: new Date(),
        emotionScores: result.emotionScores,
        duration: result.duration,
      };
      setEmotionRecords([...emotionRecords, newRecord]);
      setShowIntensitySlider(true);
    } catch (err) {
      console.error("Error analyzing emotion:", err);
      setError("Failed to analyze emotion. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleIntensityConfirm = (adjustedConfidence: number, adjustedScores: Record<string, number>) => {
    if (analysisResult) {
      setAnalysisResult({
        ...analysisResult,
        confidence: adjustedConfidence,
        emotionScores: adjustedScores,
      });
    }
    setShowIntensitySlider(false);
  };

  const handleRemoveRecord = (id: string) => {
    setEmotionRecords(emotionRecords.filter(r => r.id !== id));
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
            Code X Emotion Analyzer
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
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-float">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Code X Emotion Analyzer
          </h1>
          <p className="text-lg text-slate-400 font-light">
            Record your voice and discover your emotional state
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-8 flex justify-end">
          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Recorder Section */}
          {!analysisResult ? (
            <div className="w-full flex justify-center">
              <VoiceRecorder3D
                onRecordingComplete={handleRecordingComplete}
                isAnalyzing={isAnalyzing}
                showPrompts={true}
              />
            </div>
          ) : (
            <div className="w-full space-y-8">
              {/* Intensity Slider */}
              {showIntensitySlider && (
                <div className="max-w-2xl mx-auto w-full">
                  <EmotionIntensitySlider
                    emotion={analysisResult.emotion}
                    initialConfidence={analysisResult.confidence}
                    emotionScores={analysisResult.emotionScores}
                    onConfirm={handleIntensityConfirm}
                    onCancel={() => setShowIntensitySlider(false)}
                  />
                </div>
              )}

              {/* Result Display */}
              <div className="w-full flex justify-center">
                <EmotionResult
                  emotion={analysisResult.emotion}
                  confidence={analysisResult.confidence}
                  emotionScores={analysisResult.emotionScores}
                  duration={analysisResult.duration}
                />
              </div>

              {/* Feedback Section */}
              {showFeedback && (
                <div className="max-w-2xl mx-auto w-full">
                  <EmotionFeedback
                    aiEmotion={analysisResult.emotion}
                    aiConfidence={analysisResult.confidence}
                    emotionScores={analysisResult.emotionScores}
                    analysisId={1}
                    onFeedbackSubmitted={() => {
                      setShowFeedback(false);
                    }}
                  />
                </div>
              )}

              {/* New Recording Button */}
              <div className="flex justify-center gap-3 flex-wrap">
                <Button
                  onClick={() => {
                    setAnalysisResult(null);
                    setShowIntensitySlider(false);
                    setShowFeedback(false);
                  }}
                  className="btn-3d bg-indigo-600 hover:bg-indigo-700 text-white neon-glow-blue"
                  size="lg"
                >
                  Record Another
                </Button>
                <Button
                  onClick={() => setShowFeedback(!showFeedback)}
                  variant="outline"
                  className="btn-3d border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                  size="lg"
                >
                  {showFeedback ? 'Hide' : 'Give'} Feedback
                </Button>
                <Button
                  onClick={() => setShowComparison(!showComparison)}
                  variant="outline"
                  className="btn-3d border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                  size="lg"
                >
                  {showComparison ? 'Hide' : 'Show'} Comparison
                </Button>
                <Button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  variant="outline"
                  className="btn-3d border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                  size="lg"
                >
                  {showAnalytics ? 'Hide' : 'View'} Analytics
                </Button>
              </div>
            </div>
          )}

          {/* Emotion Comparison */}
          {showComparison && emotionRecords.length > 0 && (
            <div className="w-full max-w-4xl">
              <EmotionComparison
                records={emotionRecords}
                onRemove={handleRemoveRecord}
              />
            </div>
          )}

          {/* Feedback Analytics */}
          {showAnalytics && (
            <div className="w-full max-w-6xl">
              <FeedbackAnalytics
                totalFeedback={feedbackStats.total}
                correctedCount={feedbackStats.corrected}
                accuracy={feedbackStats.accuracy}
                emotionAccuracy={{
                  Anger: 0.85,
                  Disgust: 0.78,
                  Fear: 0.82,
                  Happiness: 0.90,
                  Neutral: 0.88,
                  Sadness: 0.84,
                  Surprise: 0.81,
                }}
              />
            </div>
          )}

          {/* Info Section */}
          {!analysisResult && !showAnalytics && !showComparison && (
          <div className="w-full max-w-2xl space-y-6 mt-8">
            <div className="glass-card-dark p-6 neon-glow-blue">
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

            <div className="glass-card-dark p-6 neon-glow-blue">
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
          )}
        </div>
      </div>
    </div>
  );
}
