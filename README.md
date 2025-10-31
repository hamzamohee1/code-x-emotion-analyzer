# Voice Emotion Analyzer 🎤😊

A sophisticated 3D animated web application that analyzes emotions from voice recordings using advanced deep learning models. Record your voice and discover your emotional state with real-time audio visualization and AI-powered emotion detection.

![Voice Emotion Analyzer](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)

## 🌟 Features

### Core Functionality
- **Voice Recording**: High-quality audio capture with echo cancellation and noise suppression
- **Emotion Detection**: Deep learning-powered emotion analysis using Hugging Face Inference API
- **7 Emotion Categories**: Anger, Disgust, Fear, Happiness, Neutral, Sadness, Surprise
- **Real-time Confidence Scores**: Detailed probability distribution for all emotions

### Advanced Features
- **3D Animated Interface**: Interactive Three.js sphere that responds to audio frequencies
- **Real-time Waveform Analysis**: Live frequency visualization with bass, mid, treble indicators
- **Emotion Comparison**: Track and compare multiple emotion recordings side-by-side
- **Emotion Intensity Slider**: Fine-tune AI predictions with confidence adjustments
- **Guided Recording Prompts**: 4 categories of prompts to generate consistent voice samples
- **Multi-Language Support**: 12 languages including English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean, Russian, Arabic, and Hindi

### User Feedback System
- **Emotion Correction**: Users can confirm or correct AI predictions
- **Feedback Analytics**: Comprehensive dashboard showing model accuracy metrics
- **Emotion-Specific Performance**: Track accuracy for each emotion category
- **Helpfulness Ratings**: Rate the usefulness of emotion analysis
- **Continuous Improvement**: Feedback data helps improve model accuracy over time

### Design & UX
- **Black 3D Theme**: Premium dark theme with glass-morphism effects
- **Neon Glow Effects**: Modern UI with animated neon accents
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login with Manus OAuth
- **Emotion History**: Database storage of all analyses with timestamps

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Modern web browser with microphone access
- Hugging Face API token (free)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hamzamohee1/voice-emotion-analyzer.git
cd voice-emotion-analyzer
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=your_oauth_portal_url
HUGGING_FACE_API_KEY=your_hugging_face_api_key
VITE_APP_TITLE=Voice Emotion Analyzer
VITE_APP_LOGO=your_logo_url
```

4. **Push database schema**
```bash
pnpm db:push
```

5. **Start the development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📱 How to Use

### Recording Your Voice
1. Click **"Start Recording"** to begin capturing your voice
2. Speak naturally for up to 10 seconds
3. The 3D sphere animates in real-time, responding to your voice frequencies
4. Click **"Stop Recording"** when done

### Understanding Results
- **Emotion Detection**: AI analyzes your voice and displays the detected emotion
- **Confidence Score**: Shows how confident the model is (0-100%)
- **Emotion Breakdown**: View probability scores for all 7 emotions
- **Waveform Visualization**: See real-time frequency analysis during recording

### Providing Feedback
1. After analysis, click **"Give Feedback"**
2. Confirm if the emotion is correct or select the actual emotion
3. Adjust confidence level if needed
4. Add optional comments about the analysis
5. Rate the helpfulness (1-5 stars)
6. Submit to help improve the model

### Comparing Recordings
1. Record multiple voice samples
2. Click **"Show Comparison"** to view side-by-side analysis
3. See emotion distribution charts and statistics
4. Track your emotional patterns over time

### Viewing Analytics
1. Click **"View Analytics"** to access the feedback dashboard
2. Monitor overall model accuracy
3. View emotion-specific performance metrics
4. Track correction patterns and user feedback trends

## 🏗️ Architecture

### Frontend Stack
- **React 19**: Modern UI framework with hooks
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics and animations
- **Tailwind CSS 4**: Utility-first styling
- **Recharts**: Data visualization for analytics
- **tRPC**: End-to-end type-safe API communication

### Backend Stack
- **Express.js**: Web server framework
- **tRPC**: Type-safe RPC framework
- **Drizzle ORM**: Type-safe database queries
- **MySQL/TiDB**: Relational database
- **Hugging Face API**: Deep learning emotion detection

### Key Technologies
- **Web Audio API**: Voice recording and frequency analysis
- **Canvas/WebGL**: Real-time audio visualization
- **OAuth 2.0**: Secure user authentication
- **S3 Storage**: Audio file storage (optional)

## 📊 Database Schema

### Users Table
```sql
- id (Primary Key)
- openId (OAuth identifier)
- name
- email
- role (user/admin)
- createdAt, updatedAt, lastSignedIn
```

### Emotion Analyses Table
```sql
- id (Primary Key)
- userId (Foreign Key)
- audioUrl
- emotion
- confidence (0-100)
- emotionScores (JSON)
- duration (seconds)
- createdAt
```

### Emotion Feedback Table
```sql
- id (Primary Key)
- userId (Foreign Key)
- analysisId (Foreign Key)
- aiPredictedEmotion
- aiConfidence
- userCorrectedEmotion
- userConfidence
- isCorrected (boolean)
- feedback (text)
- helpfulnessRating (1-5)
- createdAt, updatedAt
```

## 🔌 API Endpoints

### Authentication
- `POST /api/oauth/callback` - OAuth callback handler
- `GET /api/trpc/auth.me` - Get current user
- `POST /api/trpc/auth.logout` - Logout user

### Emotion Analysis
- `POST /api/trpc/emotion.analyze` - Save emotion analysis
- `POST /api/trpc/emotion.detectFromUrl` - Detect emotion from audio URL
- `GET /api/trpc/emotion.history` - Get user's emotion history

### Feedback System
- `POST /api/trpc/feedback.submit` - Submit emotion feedback
- `GET /api/trpc/feedback.getUserHistory` - Get user's feedback history
- `GET /api/trpc/feedback.getStats` - Get global feedback statistics

## 🎨 Emotion Categories & Colors

| Emotion | Emoji | Color | RGB |
|---------|-------|-------|-----|
| Anger | 😠 | Red | #ef4444 |
| Disgust | 🤢 | Green | #22c55e |
| Fear | 😨 | Purple | #a855f7 |
| Happiness | 😊 | Yellow | #eab308 |
| Neutral | 😐 | Gray | #6b7280 |
| Sadness | 😢 | Blue | #3b82f6 |
| Surprise | 😮 | Pink | #ec4899 |

## 🔐 Security Features

- **OAuth 2.0 Authentication**: Secure user login
- **JWT Session Tokens**: Encrypted session management
- **HTTPS Only**: All connections encrypted
- **Input Validation**: Server-side validation of all inputs
- **CORS Protection**: Cross-origin request handling
- **Rate Limiting**: API rate limiting to prevent abuse
- **Audio Privacy**: Audio files stored securely with user-specific access

## 🚀 Deployment

### Deploy to Production

1. **Build the application**
```bash
pnpm build
```

2. **Set production environment variables**
```bash
export NODE_ENV=production
export DATABASE_URL=your_production_db_url
export HUGGING_FACE_API_KEY=your_api_key
# ... other env variables
```

3. **Start the server**
```bash
pnpm start
```

### Deploy to Vercel/Netlify
The project is optimized for serverless deployment. Follow platform-specific guides for:
- Vercel: Set environment variables in project settings
- Netlify: Use netlify.toml for configuration

### Docker Deployment
```bash
docker build -t voice-emotion-analyzer .
docker run -p 3000:3000 voice-emotion-analyzer
```

## 📈 Performance Optimization

- **Code Splitting**: Lazy-loaded components for faster initial load
- **Audio Compression**: WebM codec for efficient audio storage
- **Real-time Processing**: Optimized frequency analysis with Web Audio API
- **Database Indexing**: Indexed queries for fast data retrieval
- **Caching**: Browser caching for static assets
- **CDN Ready**: Global CDN support for asset delivery

## 🧪 Testing

### Run Tests
```bash
pnpm test
```

### Test Coverage
```bash
pnpm test:coverage
```

## 📚 Project Structure

```
voice-emotion-analyzer/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   ├── contexts/         # React contexts
│   │   └── App.tsx           # Main app component
│   ├── public/               # Static assets
│   └── index.html            # HTML template
├── server/                    # Backend Express server
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   ├── emotionAnalysis.ts    # Emotion detection logic
│   ├── audioPreprocessing.ts # Audio preprocessing
│   └── _core/                # Framework internals
├── drizzle/                   # Database schema & migrations
│   ├── schema.ts             # Table definitions
│   └── migrations/           # Migration files
├── shared/                    # Shared types & constants
└── README.md                  # This file
```

## 🔧 Configuration

### Audio Recording Settings
- **Sample Rate**: 48000 Hz
- **Channels**: Mono
- **Codec**: Opus (WebM)
- **Echo Cancellation**: Enabled
- **Noise Suppression**: Enabled
- **Auto Gain Control**: Enabled

### Emotion Detection
- **Model**: jihedjabnoun/wavlm-base-emotion
- **API**: Hugging Face Inference API
- **Confidence Threshold**: 0% (all predictions shown)
- **Processing Time**: ~2-5 seconds per recording

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Maintain code style consistency

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face**: For the powerful emotion detection model
- **Three.js**: For 3D graphics capabilities
- **React**: For the UI framework
- **Tailwind CSS**: For styling utilities
- **tRPC**: For type-safe API communication

## 📞 Support & Contact

- **Issues**: Report bugs on [GitHub Issues](https://github.com/hamzamohee1/voice-emotion-analyzer/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/hamzamohee1/voice-emotion-analyzer/discussions)
- **Email**: Contact via GitHub profile

## 🗺️ Roadmap

### Upcoming Features
- [ ] Real-time emotion streaming for live events
- [ ] Emotion trend analysis over time
- [ ] Voice characteristics analysis (pitch, tone, speed)
- [ ] Integration with calendar for mood tracking
- [ ] Mobile app (React Native)
- [ ] Voice emotion training dataset
- [ ] Custom model fine-tuning
- [ ] API for third-party integrations
- [ ] Emotion-based music recommendations
- [ ] Social sharing features

### Performance Improvements
- [ ] WebAssembly for audio processing
- [ ] Edge computing for faster analysis
- [ ] Model quantization for faster inference
- [ ] Offline mode support

## 📊 Statistics

- **Emotions Detected**: 7 categories
- **Supported Languages**: 12
- **Recording Duration**: Up to 10 seconds
- **Model Accuracy**: ~85% average
- **Response Time**: 2-5 seconds
- **Database Queries**: Optimized with indexes

---

**Built with ❤️ using React, Three.js, and Deep Learning**

⭐ If you find this project helpful, please consider giving it a star on GitHub!
