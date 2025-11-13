# Setup Instructions

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- pip (Python package manager)

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

## Running Both Services

You'll need to run both the frontend and backend simultaneously:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
uvicorn main:app --reload
```

## Features

- ✅ Adaptive learning algorithm
- ✅ Gamification (XP, coins, badges, levels)
- ✅ Diagnostic mini-games
- ✅ Real-time difficulty adjustment
- ✅ Mouse tracking and analytics
- ✅ AI-powered feedback
- ✅ Metacognitive prompts
- ✅ Progress dashboard
- ✅ Math anxiety survey
- ✅ Multisensory learning elements

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main app flow
│   ├── dashboard/         # Progress dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── WelcomeScreen.tsx
│   ├── MathFeelingSlider.tsx
│   ├── DiagnosticGame.tsx
│   ├── LearningGame.tsx
│   ├── SessionComplete.tsx
│   └── ...
├── lib/                   # Utilities and stores
│   ├── store.ts           # Zustand state management
│   ├── adaptiveAlgorithm.ts
│   ├── gameGenerator.ts
│   ├── feedback.ts
│   └── api.ts
└── backend/               # Python FastAPI backend
    └── main.py
```

## Development Notes

- The app uses localStorage for persistence (via Zustand)
- Session data is logged locally and can be sent to the backend API
- The adaptive algorithm adjusts difficulty in real-time
- All user interactions are tracked for research purposes

