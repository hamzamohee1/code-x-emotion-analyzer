import { ENV } from './_core/env';

const HF_API_URL = "https://api-inference.huggingface.co/models/jihedjabnoun/wavlm-base-emotion";
const MODEL_NAME = "jihedjabnoun/wavlm-base-emotion";

interface EmotionPrediction {
  label: string;
  score: number;
}

interface AnalysisResult {
  emotion: string;
  confidence: number;
  emotionScores: Record<string, number>;
}

const EMOTION_LABELS = [
  "Anger",
  "Disgust",
  "Fear",
  "Happiness",
  "Neutral",
  "Sadness",
  "Surprise",
];

/**
 * Analyzes emotion from audio URL using Hugging Face Inference API
 * @param audioUrl URL to the audio file (must be accessible)
 * @returns Emotion analysis result with confidence scores
 */
export async function analyzeEmotionFromAudio(
  audioUrl: string
): Promise<AnalysisResult> {
  if (!ENV.huggingFaceApiKey) {
    throw new Error("HUGGING_FACE_API_KEY environment variable is not set");
  }

  try {
    // Fetch the audio file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`);
    }

    const audioBuffer = await audioResponse.arrayBuffer();

    // Call Hugging Face Inference API
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.huggingFaceApiKey}`,
        "Content-Type": "application/octet-stream",
      },
      body: audioBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API Error:", errorText);
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const predictions: EmotionPrediction[] = await response.json();

    // Process predictions
    const emotionScores: Record<string, number> = {};
    let maxScore = 0;
    let maxEmotion = "Neutral";

    for (const prediction of predictions) {
      const label = prediction.label;
      const score = prediction.score;

      emotionScores[label] = score;

      if (score > maxScore) {
        maxScore = score;
        maxEmotion = label;
      }
    }

    // Ensure all emotions are in the result
    for (const emotion of EMOTION_LABELS) {
      if (!(emotion in emotionScores)) {
        emotionScores[emotion] = 0;
      }
    }

    return {
      emotion: maxEmotion,
      confidence: Math.round(maxScore * 100),
      emotionScores,
    };
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw error;
  }
}

/**
 * Analyzes emotion from audio blob (base64 encoded)
 * @param audioBase64 Base64 encoded audio data
 * @returns Emotion analysis result with confidence scores
 */
export async function analyzeEmotionFromBlob(
  audioBase64: string
): Promise<AnalysisResult> {
  if (!ENV.huggingFaceApiKey) {
    throw new Error("HUGGING_FACE_API_KEY environment variable is not set");
  }

  try {
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, "base64");

    // Call Hugging Face Inference API
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.huggingFaceApiKey}`,
        "Content-Type": "application/octet-stream",
      },
      body: audioBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API Error:", errorText);
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const predictions: EmotionPrediction[] = await response.json();

    // Process predictions
    const emotionScores: Record<string, number> = {};
    let maxScore = 0;
    let maxEmotion = "Neutral";

    for (const prediction of predictions) {
      const label = prediction.label;
      const score = prediction.score;

      emotionScores[label] = score;

      if (score > maxScore) {
        maxScore = score;
        maxEmotion = label;
      }
    }

    // Ensure all emotions are in the result
    for (const emotion of EMOTION_LABELS) {
      if (!(emotion in emotionScores)) {
        emotionScores[emotion] = 0;
      }
    }

    return {
      emotion: maxEmotion,
      confidence: Math.round(maxScore * 100),
      emotionScores,
    };
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw error;
  }
}
