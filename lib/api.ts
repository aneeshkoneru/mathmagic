/**
 * API client for backend communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface SessionData {
  sessionId: string
  startTime: number
  endTime?: number
  mouseEvents: Array<{ x: number; y: number; timestamp: number }>
  answers: Array<{ questionId: string; answer: any; correct: boolean; timeSpent: number }>
  attentionChecks: Array<{ passed: boolean; timestamp: number }>
}

export interface DiagnosticResult {
  workingMemory: number
  attention: number
  processingSpeed: number
  executiveFunction: number
  estimatedSkillLevel: number
}

export async function saveSession(sessionData: SessionData) {
  try {
    const response = await fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to save session:', error)
    return null
  }
}

export async function submitDiagnostic(result: DiagnosticResult) {
  try {
    const response = await fetch(`${API_URL}/api/diagnostic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to submit diagnostic:', error)
    return null
  }
}

export async function submitMathFeeling(score: number) {
  try {
    const response = await fetch(`${API_URL}/api/survey/math-feeling`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, timestamp: Date.now() }),
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to submit math feeling:', error)
    return null
  }
}

export async function updateProgress(progress: {
  level: number
  xp: number
  coins: number
  badges: string[]
  sessionsCompleted: number
}) {
  try {
    const response = await fetch(`${API_URL}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress),
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to update progress:', error)
    return null
  }
}

export async function getSessionAnalytics(sessionId: string) {
  try {
    const response = await fetch(`${API_URL}/api/analytics/session/${sessionId}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to get analytics:', error)
    return null
  }
}

