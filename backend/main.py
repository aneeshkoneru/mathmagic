"""
FastAPI Backend for Math Intervention App
Handles data collection, analytics, and adaptive algorithm processing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime

app = FastAPI(title="Math Intervention API", version="1.0.0")

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class MouseEvent(BaseModel):
    x: float
    y: float
    timestamp: int

class Answer(BaseModel):
    questionId: str
    answer: any
    correct: bool
    timeSpent: int

class AttentionCheck(BaseModel):
    passed: bool
    timestamp: int

class SessionData(BaseModel):
    sessionId: str
    startTime: int
    endTime: Optional[int] = None
    mouseEvents: List[MouseEvent] = []
    answers: List[Answer] = []
    attentionChecks: List[AttentionCheck] = []

class DiagnosticResult(BaseModel):
    workingMemory: float
    attention: float
    processingSpeed: float
    executiveFunction: float
    estimatedSkillLevel: float

class MathFeelingSurvey(BaseModel):
    score: int  # 1-10
    timestamp: int

class ProgressUpdate(BaseModel):
    userId: Optional[str] = None
    level: int
    xp: int
    coins: int
    badges: List[str]
    sessionsCompleted: int

# In-memory storage (replace with database in production)
sessions_db: dict = {}
progress_db: dict = {}

@app.get("/")
async def root():
    return {"message": "Math Intervention API", "status": "running"}

@app.post("/api/sessions")
async def create_session(sessionData: SessionData):
    """Store session data"""
    sessions_db[sessionData.sessionId] = sessionData.dict()
    return {"status": "success", "sessionId": sessionData.sessionId}

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    """Retrieve session data"""
    if session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions_db[session_id]

@app.post("/api/diagnostic")
async def submit_diagnostic(result: DiagnosticResult):
    """Process and store diagnostic results"""
    # In production, this would update user profile and initialize skill estimate
    return {
        "status": "success",
        "recommendedDifficulty": result.estimatedSkillLevel,
        "skillEstimate": result.dict()
    }

@app.post("/api/survey/math-feeling")
async def submit_math_feeling(survey: MathFeelingSurvey):
    """Store math anxiety/feeling survey response"""
    # In production, this would be stored in user profile
    return {"status": "success", "score": survey.score}

@app.post("/api/progress")
async def update_progress(progress: ProgressUpdate):
    """Update user progress"""
    user_id = progress.userId or "default"
    if user_id not in progress_db:
        progress_db[user_id] = progress.dict()
    else:
        progress_db[user_id].update(progress.dict())
    return {"status": "success", "progress": progress_db[user_id]}

@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str):
    """Get user progress"""
    if user_id not in progress_db:
        return {"level": 1, "xp": 0, "coins": 0, "badges": [], "sessionsCompleted": 0}
    return progress_db[user_id]

@app.get("/api/analytics/session/{session_id}")
async def get_session_analytics(session_id: str):
    """Get analytics for a session"""
    if session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions_db[session_id]
    answers = session.get("answers", [])
    
    if not answers:
        return {
            "accuracy": 0,
            "totalQuestions": 0,
            "averageTime": 0,
            "attentionScore": 0
        }
    
    correct = sum(1 for a in answers if a.get("correct", False))
    total = len(answers)
    avg_time = sum(a.get("timeSpent", 0) for a in answers) / total if total > 0 else 0
    
    attention_checks = session.get("attentionChecks", [])
    attention_score = sum(1 for ac in attention_checks if ac.get("passed", False)) / len(attention_checks) * 100 if attention_checks else 0
    
    return {
        "accuracy": (correct / total * 100) if total > 0 else 0,
        "totalQuestions": total,
        "averageTime": avg_time,
        "attentionScore": attention_score,
        "mouseEventsCount": len(session.get("mouseEvents", []))
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

