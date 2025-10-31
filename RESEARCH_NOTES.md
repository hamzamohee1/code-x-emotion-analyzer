# Voice Emotion Analyzer - Research Notes

## Emotion Detection Options

### 1. Hugging Face Inference API (Recommended)
**Model**: `jihedjabnoun/wavlm-base-emotion`
- **Type**: WavLM-Base for Sequence Classification
- **Emotions Detected**: 7 emotions (Anger, Disgust, Fear, Happiness, Neutral, Sadness, Surprise)
- **Training Data**: 18,687 samples from MELD, CREMA-D, TESS, RAVDESS, SAVEE
- **Accuracy**: 30.3% (note: model may need improvement)
- **Parameters**: ~95M
- **Language**: English
- **Advantages**: 
  - Free Inference API available
  - Easy integration via Python/JavaScript
  - No infrastructure setup required
  - Supports audio file uploads
- **Disadvantages**:
  - Lower accuracy than state-of-the-art models
  - May need fine-tuning for production use

### 2. Alternative Models on Hugging Face
- `m3hrdadfi/hubert-base-greek-speech-emotion-recognition`
- `m3hrdadfi/wav2vec2-xlsr-greek-speech-emotion-recognition`
- `CAiRE/SER-wav2vec2-large-xlsr-53-eng-zho-all-age`
- Multiple language-specific models available

### 3. Commercial Services
- **Azure AI Speech**: Comprehensive speech analysis
- **Hume AI**: Emotional intelligence voice AI
- **Affectiva**: Emotion AI for consumer engagement
- **Imentiv AI**: Multimodal emotion recognition (video, audio, text)

## Implementation Strategy

### Backend Flow
1. User records audio via Web Audio API
2. Frontend uploads audio to S3 storage
3. Backend receives S3 URL
4. Backend calls Hugging Face Inference API with audio URL
5. API returns emotion predictions with confidence scores
6. Backend stores results in database
7. Frontend displays emotion visualization

### Required Technologies
- **Frontend**: Web Audio API for recording, Three.js for 3D animation
- **Backend**: Node.js/Express, tRPC for API
- **Storage**: S3 for audio files
- **Database**: MySQL for storing analysis history
- **ML API**: Hugging Face Inference API

### Audio Processing
- Sample Rate: 16kHz (required by model)
- Format: WAV or MP3
- Max Duration: 10 seconds (model limit)
- File Size: Keep under 16MB for API limits

## Next Steps
1. Set up Hugging Face API token
2. Implement audio recording in frontend
3. Create backend endpoint for emotion analysis
4. Build 3D visualization with Three.js
5. Integrate with database for history tracking
