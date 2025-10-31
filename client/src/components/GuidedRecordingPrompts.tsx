import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Volume2 } from 'lucide-react';

interface GuidedRecordingPromptsProps {
  isRecording: boolean;
  recordingTime: number;
}

const prompts = [
  {
    category: 'Daily Life',
    questions: [
      'Tell me about your day so far.',
      'What made you smile today?',
      'Describe something that frustrated you recently.',
      'What are you looking forward to?',
      'How are you feeling right now?',
    ],
  },
  {
    category: 'Emotions',
    questions: [
      'What makes you feel happy?',
      'Describe a time when you felt angry.',
      'When do you feel most peaceful?',
      'What scares you the most?',
      'Tell me about something that surprised you.',
    ],
  },
  {
    category: 'Reflections',
    questions: [
      'What are you grateful for today?',
      'Describe your biggest achievement.',
      'What would you change about yourself?',
      'Who inspires you and why?',
      'What does success mean to you?',
    ],
  },
  {
    category: 'Quick Reactions',
    questions: [
      'React to this: You just won the lottery!',
      'How would you respond to unexpected news?',
      'Share your first impression of something.',
      'Describe your ideal weekend.',
      'What\'s your biggest pet peeve?',
    ],
  },
];

export function GuidedRecordingPrompts({
  isRecording,
  recordingTime,
}: GuidedRecordingPromptsProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    if (isRecording && recordingTime > 0 && recordingTime % 3 === 0) {
      // Rotate prompts every 3 seconds during recording
      setShowPrompt(true);
    }
  }, [isRecording, recordingTime]);

  const currentPrompts = prompts[currentCategory];
  const currentQuestion = currentPrompts.questions[currentPromptIndex];

  const handleNextPrompt = () => {
    setCurrentPromptIndex(
      (prev) => (prev + 1) % currentPrompts.questions.length
    );
  };

  const handleNextCategory = () => {
    setCurrentCategory((prev) => (prev + 1) % prompts.length);
    setCurrentPromptIndex(0);
  };

  if (!isRecording) {
    return (
      <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Recording Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-8">
            Start recording to see guided prompts that help you generate consistent voice samples.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card-dark border-indigo-500/30 neon-glow-blue animate-glow-pulse">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400 animate-bounce" />
            <span>Recording Prompt</span>
          </div>
          <span className="text-sm font-normal text-slate-400">
            {currentCategory + 1} of {prompts.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded-full">
            <p className="text-xs font-semibold text-indigo-300">
              {currentPrompts.category}
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Question {currentPromptIndex + 1} of {currentPrompts.questions.length}
          </p>
        </div>

        {/* Main Prompt */}
        <div className="glass-card p-6 border-l-4 border-indigo-500 space-y-4">
          <div className="flex items-start gap-4">
            <Volume2 className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-lg font-semibold text-white leading-relaxed">
                {currentQuestion}
              </p>
              <p className="text-xs text-slate-400 mt-3">
                💡 Speak naturally and express your genuine thoughts and feelings.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Recording Progress</span>
            <span>{recordingTime}s / 10s</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-2 rounded-full transition-all"
              style={{ width: `${(recordingTime / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNextPrompt}
            className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-lg text-sm font-medium text-indigo-300 transition-colors"
          >
            Next Question
          </button>
          <button
            onClick={handleNextCategory}
            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 rounded-lg text-sm font-medium text-purple-300 transition-colors"
          >
            Change Category
          </button>
        </div>

        {/* Tips */}
        <div className="space-y-2 text-xs text-slate-400">
          <p>✨ Tips for better emotion detection:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>Speak clearly and naturally</li>
            <li>Express genuine emotions in your voice</li>
            <li>Vary your tone and pace</li>
            <li>Take a breath between sentences</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
