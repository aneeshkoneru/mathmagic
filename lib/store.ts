import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SessionPhase = 'welcome' | 'feeling-check' | 'diagnostic' | 'learning' | 'complete'

export interface UserProgress {
  level: number
  xp: number
  badges: string[]
  coins: number
  sessionsCompleted: number
  totalPlayTime: number
}

export interface DiagnosticResult {
  workingMemory: number // 0-100
  attention: number // 0-100
  processingSpeed: number // 0-100
  executiveFunction: number // 0-100
  estimatedSkillLevel: number // 0-100
}

export interface SessionData {
  sessionId: string
  startTime: number
  endTime?: number
  mouseEvents: Array<{ x: number; y: number; timestamp: number }>
  answers: Array<{ questionId: string; answer: any; correct: boolean; timeSpent: number }>
  attentionChecks: Array<{ passed: boolean; timestamp: number }>
}

export interface GameState {
  currentPhase: SessionPhase
  userProgress: UserProgress
  diagnosticResult?: DiagnosticResult
  mathFeelingScore?: number // 1-10
  currentDifficulty: number // 0-100
  sessionData: SessionData
  currentGameType?: 'working-memory' | 'attention' | 'math-practice' | 'sequencing'
}

interface SessionStore {
  gameState: GameState
  initializeSession: () => void
  setPhase: (phase: SessionPhase) => void
  updateMathFeeling: (score: number) => void
  updateDiagnosticResult: (result: DiagnosticResult) => void
  updateProgress: (updates: Partial<UserProgress>) => void
  addXP: (amount: number) => void
  addCoins: (amount: number) => void
  addBadge: (badgeId: string) => void
  logMouseEvent: (x: number, y: number) => void
  logAnswer: (questionId: string, answer: any, correct: boolean, timeSpent: number) => void
  logAttentionCheck: (passed: boolean) => void
  adjustDifficulty: (adjustment: number) => void
  setCurrentGameType: (type: GameState['currentGameType']) => void
  completeSession: () => void
}

const initialProgress: UserProgress = {
  level: 1,
  xp: 0,
  badges: [],
  coins: 0,
  sessionsCompleted: 0,
  totalPlayTime: 0,
}

const createNewSession = (): SessionData => ({
  sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  startTime: Date.now(),
  mouseEvents: [],
  answers: [],
  attentionChecks: [],
})

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      gameState: {
        currentPhase: 'welcome',
        userProgress: initialProgress,
        currentDifficulty: 30, // Start at easy level
        sessionData: createNewSession(),
      },
      initializeSession: () => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            sessionData: createNewSession(),
            currentPhase: 'welcome',
          },
        }))
      },
      setPhase: (phase: SessionPhase) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            currentPhase: phase,
          },
        }))
      },
      updateMathFeeling: (score: number) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            mathFeelingScore: score,
          },
        }))
      },
      updateDiagnosticResult: (result: DiagnosticResult) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            diagnosticResult: result,
            currentDifficulty: result.estimatedSkillLevel,
          },
        }))
      },
      updateProgress: (updates: Partial<UserProgress>) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            userProgress: {
              ...state.gameState.userProgress,
              ...updates,
            },
          },
        }))
      },
      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.gameState.userProgress.xp + amount
          const xpPerLevel = 100
          const newLevel = Math.floor(newXP / xpPerLevel) + 1
          return {
            gameState: {
              ...state.gameState,
              userProgress: {
                ...state.gameState.userProgress,
                xp: newXP,
                level: newLevel,
              },
            },
          }
        })
      },
      addCoins: (amount: number) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            userProgress: {
              ...state.gameState.userProgress,
              coins: state.gameState.userProgress.coins + amount,
            },
          },
        }))
      },
      addBadge: (badgeId: string) => {
        set((state) => {
          if (state.gameState.userProgress.badges.includes(badgeId)) {
            return state
          }
          return {
            gameState: {
              ...state.gameState,
              userProgress: {
                ...state.gameState.userProgress,
                badges: [...state.gameState.userProgress.badges, badgeId],
              },
            },
          }
        })
      },
      logMouseEvent: (x: number, y: number) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            sessionData: {
              ...state.gameState.sessionData,
              mouseEvents: [
                ...state.gameState.sessionData.mouseEvents,
                { x, y, timestamp: Date.now() },
              ],
            },
          },
        }))
      },
      logAnswer: (questionId: string, answer: any, correct: boolean, timeSpent: number) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            sessionData: {
              ...state.gameState.sessionData,
              answers: [
                ...state.gameState.sessionData.answers,
                { questionId, answer, correct, timeSpent },
              ],
            },
          },
        }))
      },
      logAttentionCheck: (passed: boolean) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            sessionData: {
              ...state.gameState.sessionData,
              attentionChecks: [
                ...state.gameState.sessionData.attentionChecks,
                { passed, timestamp: Date.now() },
              ],
            },
          },
        }))
      },
      adjustDifficulty: (adjustment: number) => {
        set((state) => {
          const newDifficulty = Math.max(
            0,
            Math.min(100, state.gameState.currentDifficulty + adjustment)
          )
          return {
            gameState: {
              ...state.gameState,
              currentDifficulty: newDifficulty,
            },
          }
        })
      },
      setCurrentGameType: (type: GameState['currentGameType']) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            currentGameType: type,
          },
        }))
      },
      completeSession: () => {
        set((state) => {
          const sessionDuration = Date.now() - state.gameState.sessionData.startTime
          return {
            gameState: {
              ...state.gameState,
              sessionData: {
                ...state.gameState.sessionData,
                endTime: Date.now(),
              },
              userProgress: {
                ...state.gameState.userProgress,
                sessionsCompleted: state.gameState.userProgress.sessionsCompleted + 1,
                totalPlayTime: state.gameState.userProgress.totalPlayTime + sessionDuration,
              },
              currentPhase: 'complete',
            },
          }
        })
      },
    }),
    {
      name: 'math-adventure-storage',
      partialize: (state) => ({
        gameState: {
          ...state.gameState,
          sessionData: createNewSession(), // Don't persist session data
        },
      }),
    }
  )
)

