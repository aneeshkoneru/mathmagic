# Backend API

FastAPI backend for the Math Intervention App.

## Setup

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `POST /api/sessions` - Store session data
- `GET /api/sessions/{session_id}` - Retrieve session data
- `POST /api/diagnostic` - Submit diagnostic results
- `POST /api/survey/math-feeling` - Submit math feeling survey
- `POST /api/progress` - Update user progress
- `GET /api/progress/{user_id}` - Get user progress
- `GET /api/analytics/session/{session_id}` - Get session analytics

## Documentation

API documentation available at `http://localhost:8000/docs` (Swagger UI)

