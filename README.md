# AI-Native, Gamified Math App for Dyscalculia & Math Anxiety

A web-based intervention app targeting children ages 5-13 (grades K-8) who experience math anxiety or dyscalculia.

## Features

- **Adaptive Learning**: Real-time skill assessment and difficulty adjustment using AI algorithms
- **Gamification**: Progress bars, badges, interactive storylines, and rewards
- **Multisensory Learning**: Interactive elements with visuals, sounds, and kinesthetic challenges
- **Data Collection**: Mouse tracking, session logging, and progress analytics
- **AI Feedback**: Immediate, encouraging feedback to build confidence
- **Cognitive Training**: Working memory, attention, processing speed, and executive function games

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Python (FastAPI), JavaScript/Node.js
- **State Management**: Zustand
- **Animations**: Framer Motion

## Getting Started

### Frontend Setup

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities and stores
├── backend/                # Python FastAPI backend
│   ├── algorithms/         # Adaptive learning algorithms
│   ├── models/             # Data models
│   └── api/                # API routes
└── public/                 # Static assets
```

## Key Components

- **Diagnostic Games**: Initial assessment of cognitive skills
- **Learning Games**: Personalized math practice with adaptive difficulty
- **Progress Dashboard**: Visual progress tracking for students, parents, and teachers
- **Survey System**: Pre/post math anxiety measures

# mathmagic
