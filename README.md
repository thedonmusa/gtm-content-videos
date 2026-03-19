# GTM Content Videos

Comprehensive API integrations for ElevenLabs, HeyGen, and Remotion with GTM skills and knowledge base.

## Features

- 🎤 **ElevenLabs**: AI text-to-speech generation
- 🎬 **HeyGen**: AI avatar video creation
- 🎥 **Remotion**: Programmatic video editing
- 📚 **GTM Skills**: Outbound, ABM, and RevOps expertise
- 🧠 **Knowledge Base**: Campaign frameworks and scoring criteria
- 🤖 **Agency Agents**: Marketing, Sales, Strategy, and Engineering AI agents

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Add your API keys to `.env`:
   - `ELEVENLABS_API_KEY=your_key_here`
   - `HEYGEN_API_KEY=your_key_here`

## Usage

### Test Connections
```bash
node test-connection.js
```

### Generate Complete Video
```bash
node generate-video.js
```

### Remotion Preview
```bash
npm run preview
```

### Run API Demo
```bash
node demo.js
```

## Project Structure

```
├── lib/                    # Core API integrations
│   ├── elevenlabs.js      # ElevenLabs API wrapper
│   ├── heygen.js          # HeyGen API wrapper
│   └── videoGenerator.js  # Complete video generation
├── agents/                # AI Agent specialists
│   ├── marketing/         # Marketing AI agents
│   ├── sales/            # Sales AI agents
│   ├── strategy/         # Strategy AI agents
│   └── engineering/      # Engineering AI agents
├── gtm-skills/            # GTM expertise modules
│   ├── 01-outbound/       # Outbound sales strategies
│   ├── 02-abm/           # Account-based marketing
│   └── 03-revops/        # Revenue operations
├── knowledge/             # Knowledge base
│   ├── CLAUDE.md         # System instructions
│   ├── copy-framework.md # Copy writing framework
│   └── scoring-criteria.md # Campaign scoring
├── src/                  # Remotion video components
└── out/                  # Generated outputs
```

## API Classes

### GTMContentVideos (Main Class)
```javascript
const GTMContentVideos = require('./');
const gtm = new GTMContentVideos();

// Generate complete video
const result = await gtm.generateCompleteVideo({
    text: "Your script",
    titleText: "Video Title",
    useElevenLabs: true
});
```

### ElevenLabs
```javascript
const ElevenLabs = require('./lib/elevenlabs');
const elevenlabs = new ElevenLabs();

// Get voices
const voices = await elevenlabs.getVoices();

// Generate speech
const audioData = await elevenlabs.textToSpeech("Hello world", voiceId);
```

### HeyGen
```javascript
const HeyGen = require('./lib/heygen');
const heygen = new HeyGen();

// Create avatar video
const video = await heygen.createVideo({
    text: "Your script here",
    avatar_id: "avatar_id",
    voice_id: "voice_id"
});
```

### VideoGenerator
```javascript
const VideoGenerator = require('./lib/videoGenerator');
const generator = new VideoGenerator();

// Generate complete video with multiple APIs
const result = await generator.createCompleteVideo(options);
```

## Repository
https://github.com/thedonmusa/gtm-content-videos