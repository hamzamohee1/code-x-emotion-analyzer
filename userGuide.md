# Voice Emotion Analyzer - User Guide

**Purpose**: Discover your emotions through voice analysis. Record a message and let our AI detect your emotional state using advanced deep learning.

**Access**: Login required. Sign in with your Manus account to get started.

---
**Powered by Manus**

This application is built with cutting-edge technology:

**Frontend**: React 19 with TypeScript, Three.js for stunning 3D animations with glass-morphism effects, Tailwind CSS with premium black 3D theme, and Web Audio API with advanced audio preprocessing for enhanced accuracy.

**Backend**: Express.js with tRPC for type-safe API communication, integrated with Hugging Face's advanced speech emotion recognition model with MFCC feature extraction.

**Database**: MySQL with Drizzle ORM for secure storage of your emotion analysis history.

**AI Model**: jihedjabnoun/wavlm-base-emotion - A deep learning model trained on 18,687 voice samples that detects 7 distinct emotions with high accuracy. Enhanced with audio preprocessing including noise gate, pre-emphasis filtering, and silence trimming.

**Deployment**: Auto-scaling infrastructure with global CDN for lightning-fast performance worldwide.

---

## Using Your Website

### Recording Your Voice

Click "Start Recording" to begin capturing your voice. Speak naturally for up to 10 seconds about any topic - your feelings, your day, or anything on your mind. The beautiful 3D sphere will pulse and change color as you record, providing visual feedback.

### Analyzing Your Emotion

Once you click "Stop Recording", our AI analyzes your voice in real-time. The system detects seven emotions: Anger, Disgust, Fear, Happiness, Neutral, Sadness, and Surprise.

### Viewing Results

Your emotion analysis displays with a stunning 3D visualization rendered in a premium black 3D theme with glass-morphism effects. Each emotion has a unique visual representation: Anger shows a red icosahedron spinning rapidly, Happiness displays a golden sphere with gentle pulses, Sadness renders a blue torus with calm rotation, and each emotion has its own color scheme and shape. The visualization includes dynamic particle effects, animated aura rings, and neon glow effects that intensify with your confidence score.

Below the 3D visualization, you'll see your primary emotion with a confidence score displayed in a glass-morphism card with neon glow. A detailed breakdown of all seven emotions with percentage scores helps you understand the full emotional spectrum detected in your voice. The interface uses advanced audio preprocessing to ensure maximum accuracy in emotion detection.

---

## Managing Your Website

Access the Management UI to view your analysis history and manage your account:

**Dashboard**: View analytics about your emotion analysis patterns over time.

**Database**: See all your recorded analyses stored securely in the system.

**Settings**: Update your profile information and manage your account preferences.

**Secrets**: Ensure your Hugging Face API key is properly configured for emotion detection to work.

---

## Next Steps

Talk to Manus AI anytime to request changes or add features like emotion trends over time, voice comparison tools, or integration with other applications.

Ready to discover your emotions? Sign in now and record your first voice sample to see how our AI interprets your emotional state!

### Production Readiness

Before going live, ensure you have:

**Hugging Face API Key**: Update `HUGGING_FACE_API_KEY` in Settings → Secrets with your production Hugging Face API token from https://huggingface.co/settings/tokens

Get your production API key from Hugging Face's website before launching to ensure smooth emotion detection for all users.
