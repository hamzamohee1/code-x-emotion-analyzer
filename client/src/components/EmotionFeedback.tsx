import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from 'lucide-react';

interface EmotionFeedbackProps {
  aiEmotion: string;
  aiConfidence: number;
  emotionScores: Record<string, number>;
  analysisId: number;
  onFeedbackSubmitted: () => void;
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

const emotions = ['Anger', 'Disgust', 'Fear', 'Happiness', 'Neutral', 'Sadness', 'Surprise'];

export function EmotionFeedback({
  aiEmotion,
  aiConfidence,
  emotionScores,
  analysisId,
  onFeedbackSubmitted,
}: EmotionFeedbackProps) {
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [userConfidence, setUserConfidence] = useState(100);
  const [feedbackText, setFeedbackText] = useState('');
  const [helpfulnessRating, setHelpfulnessRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!feedbackType) return;

    setIsSubmitting(true);
    try {
      // In production, this would call the backend API
      const feedbackData = {
        analysisId,
        aiPredictedEmotion: aiEmotion,
        aiConfidence,
        userCorrectedEmotion: feedbackType === 'incorrect' ? selectedEmotion : null,
        userConfidence: feedbackType === 'incorrect' ? userConfidence : aiConfidence,
        isCorrected: feedbackType === 'incorrect',
        feedback: feedbackText || null,
        helpfulnessRating: helpfulnessRating > 0 ? helpfulnessRating : null,
      };

      // TODO: Call API endpoint to submit feedback
      console.log('Feedback submitted:', feedbackData);

      setSubmitted(true);
      setTimeout(() => {
        onFeedbackSubmitted();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4 animate-bounce" />
          <p className="text-xl font-semibold text-green-300 text-center">
            Thank you for your feedback!
          </p>
          <p className="text-slate-400 text-center mt-2">
            Your feedback helps improve our emotion detection model.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
      <CardHeader>
        <CardTitle>Help Improve Our AI</CardTitle>
        <p className="text-sm text-slate-400 mt-2">
          Was the emotion detection accurate? Your feedback helps us improve.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Prediction Summary */}
        <div className="glass-card p-4 border-l-4 border-indigo-500">
          <p className="text-sm text-slate-400 mb-2">Our prediction:</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emotionEmojis[aiEmotion]}</span>
            <div>
              <p className="font-semibold text-white">{aiEmotion}</p>
              <p className="text-sm text-indigo-300">Confidence: {aiConfidence}%</p>
            </div>
          </div>
        </div>

        {/* Feedback Type Selection */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-indigo-300">Is this correct?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setFeedbackType('correct');
                setSelectedEmotion(null);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                feedbackType === 'correct'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-600 bg-slate-900/30 hover:border-green-500/50'
              }`}
            >
              <ThumbsUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="font-semibold text-white">Yes, Correct</p>
            </button>
            <button
              onClick={() => setFeedbackType('incorrect')}
              className={`p-4 rounded-lg border-2 transition-all ${
                feedbackType === 'incorrect'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-slate-600 bg-slate-900/30 hover:border-red-500/50'
              }`}
            >
              <ThumbsDown className="w-6 h-6 mx-auto mb-2 text-red-400" />
              <p className="font-semibold text-white">No, Incorrect</p>
            </button>
          </div>
        </div>

        {/* Correction Section */}
        {feedbackType === 'incorrect' && (
          <div className="space-y-4 glass-card p-4 border-l-4 border-red-500">
            <div>
              <p className="text-sm font-semibold text-indigo-300 mb-3">
                What was the actual emotion?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => setSelectedEmotion(emotion)}
                    className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${
                      selectedEmotion === emotion
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-600 bg-slate-900/30 hover:border-indigo-500/50'
                    }`}
                  >
                    <span className="text-xl">{emotionEmojis[emotion]}</span>
                    <span className="text-sm font-medium text-white">{emotion}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedEmotion && (
              <div>
                <p className="text-sm font-semibold text-indigo-300 mb-3">
                  How confident are you? {userConfidence}%
                </p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userConfidence}
                  onChange={(e) => setUserConfidence(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Additional Feedback */}
        {feedbackType && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-indigo-300 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Additional feedback (optional)
              </p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what went wrong or what we did well..."
                className="w-full h-24 bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
              />
            </div>

            {/* Helpfulness Rating */}
            <div>
              <p className="text-sm font-semibold text-indigo-300 mb-2">
                How helpful was this analysis?
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setHelpfulnessRating(rating)}
                    className={`w-10 h-10 rounded-lg border-2 font-semibold transition-all ${
                      helpfulnessRating === rating
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300'
                        : 'border-slate-600 bg-slate-900/30 text-slate-400 hover:border-yellow-500/50'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {feedbackType && (feedbackType === 'correct' || selectedEmotion) && (
          <Button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white neon-glow-blue"
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        )}

        {/* Info Message */}
        <div className="glass-card p-3 border-l-2 border-indigo-500">
          <p className="text-xs text-slate-300">
            💡 Your feedback is valuable and helps us train a more accurate emotion detection model. Every correction makes our AI smarter!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
