'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionStore } from '@/lib/store'
import { generateQuestion, Question } from '@/lib/gameGenerator'
import { generateQuestionParameters, updateSkillEstimate, initializeFromDiagnostic } from '@/lib/adaptiveAlgorithm'
import { generateFeedback, generateMetacognitivePrompt } from '@/lib/feedback'
import ProgressBar from './ProgressBar'
import { Coins, Star, Trophy } from 'lucide-react'

const SESSION_DURATION = 10 * 60 * 1000 // 10 minutes

export default function LearningGame() {
  const {
    gameState,
    addXP,
    addCoins,
    addBadge,
    logAnswer,
    logMouseEvent,
    adjustDifficulty,
    completeSession,
    setCurrentGameType,
  } = useSessionStore()

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [sessionStartTime] = useState(Date.now())
  const [skillEstimate, setSkillEstimate] = useState(() => {
    if (gameState.diagnosticResult) {
      return initializeFromDiagnostic(gameState.diagnosticResult)
    }
    return {
      workingMemory: 50,
      attention: 50,
      processingSpeed: 50,
      executiveFunction: 50,
      mathFluency: 50,
      confidence: 0.3,
    }
  })
  const [recentPerformance, setRecentPerformance] = useState<Array<{ correct: boolean; timeSpent: number }>>([])
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [currentFeedback, setCurrentFeedback] = useState<{ message: string; emoji: string; type: string } | null>(null)
  const [metacognitivePrompt, setMetacognitivePrompt] = useState<string | null>(null)
  const mouseTrackingRef = useRef<{ x: number; y: number; lastLog: number }>({ x: 0, y: 0, lastLog: 0 })

  useEffect(() => {
    // Generate first question
    generateNewQuestion()

    // Set up mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - mouseTrackingRef.current.lastLog > 100) { // Log every 100ms
        logMouseEvent(e.clientX, e.clientY)
        mouseTrackingRef.current = { x: e.clientX, y: e.clientY, lastLog: now }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Check session duration
    const sessionTimer = setInterval(() => {
      const elapsed = Date.now() - sessionStartTime
      if (elapsed >= SESSION_DURATION) {
        completeSession()
      }
    }, 1000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(sessionTimer)
    }
  }, [])

  const generateNewQuestion = () => {
    const params = generateQuestionParameters(skillEstimate, recentPerformance)
    const question = generateQuestion(
      params.difficulty,
      params.questionType,
      8 // Default age
    )
    setCurrentQuestion(question)
    setQuestionStartTime(Date.now())
    setSelectedAnswer(null)
    setShowFeedback(false)
    setCurrentGameType(params.questionType)
  }

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null || !currentQuestion) return

    setSelectedAnswer(answer)
    const timeSpent = Date.now() - questionStartTime
    const isCorrect = answer === currentQuestion.correctAnswer

    // Log answer
    logAnswer(currentQuestion.id, answer, isCorrect, timeSpent)

    // Update performance tracking
    const newCorrect = isCorrect ? correctAnswers + 1 : correctAnswers
    setCorrectAnswers(newCorrect)
    setQuestionsAnswered(questionsAnswered + 1)

    // Update recent performance (keep last 5)
    const newRecentPerformance = [
      ...recentPerformance.slice(-4),
      { correct: isCorrect, timeSpent },
    ]
    setRecentPerformance(newRecentPerformance)

    // Update consecutive correct count
    if (isCorrect) {
      setConsecutiveCorrect(consecutiveCorrect + 1)
    } else {
      setConsecutiveCorrect(0)
    }

    // Generate AI feedback
    const feedback = generateFeedback(
      isCorrect,
      timeSpent,
      isCorrect ? consecutiveCorrect + 1 : 0,
      gameState.mathFeelingScore
    )
    setCurrentFeedback(feedback)

    // Generate metacognitive prompt (show occasionally)
    if (Math.random() > 0.7) {
      setMetacognitivePrompt(generateMetacognitivePrompt(currentQuestion.type, isCorrect))
    }

    // Update skill estimate
    const newSkillEstimate = updateSkillEstimate(skillEstimate, {
      correctAnswers: newCorrect,
      totalAnswers: questionsAnswered + 1,
      averageResponseTime: timeSpent,
      attentionScore: 80, // Simplified
      recentPerformance: newRecentPerformance,
    })
    setSkillEstimate(newSkillEstimate)

    // Adjust difficulty
    if (isCorrect) {
      adjustDifficulty(2)
      addXP(10)
      addCoins(5)
    } else {
      adjustDifficulty(-3)
      addXP(5) // Still reward effort
    }

    // Check for badges
    if (questionsAnswered + 1 === 5) {
      addBadge('first-5')
    }
    if (newCorrect === 10) {
      addBadge('perfect-10')
    }

    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      setCurrentFeedback(null)
      setMetacognitivePrompt(null)
      generateNewQuestion()
    }, 3000)
  }

  const sessionProgress = ((Date.now() - sessionStartTime) / SESSION_DURATION) * 100

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header with progress */}
      <div className="max-w-4xl mx-auto w-full mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">Level {gameState.userProgress.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold">{gameState.userProgress.coins}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {correctAnswers}/{questionsAnswered} correct
            </div>
          </div>
          <ProgressBar
            current={Date.now() - sessionStartTime}
            max={SESSION_DURATION}
            label="Session Time"
          />
          <ProgressBar
            current={gameState.userProgress.xp % 100}
            max={100}
            label="XP to Next Level"
            className="mt-2"
          />
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {currentQuestion.type === 'addition' && '➕ Addition Challenge'}
                    {currentQuestion.type === 'subtraction' && '➖ Subtraction Challenge'}
                    {currentQuestion.type === 'number-recognition' && '🔢 Number Recognition'}
                    {currentQuestion.type === 'sequencing' && '🔢 Number Sequence'}
                    {currentQuestion.type === 'working-memory' && '🧠 Memory Challenge'}
                  </h2>
                  <p className="text-3xl text-gray-700 mb-6 min-h-[80px] flex items-center justify-center">
                    {currentQuestion.question}
                  </p>

                  {currentQuestion.visualAids && (
                    <div className="text-6xl mb-6">
                      {currentQuestion.visualAids[0]}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={`p-6 rounded-xl text-3xl font-bold transition-all ${
                        selectedAnswer === option
                          ? option === currentQuestion.correctAnswer
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-gradient-to-br from-primary-100 to-purple-100 text-primary-700 hover:from-primary-200 hover:to-purple-200'
                      } disabled:opacity-50`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-8xl mb-4"
                >
                  {currentFeedback?.emoji || (selectedAnswer === currentQuestion.correctAnswer ? '🎉' : '💪')}
                </motion.div>
                <h3 className="text-3xl font-bold mb-2 text-gray-800">
                  {currentFeedback?.message || (selectedAnswer === currentQuestion.correctAnswer
                    ? 'Excellent Work!'
                    : 'Great Effort!')}
                </h3>
                {selectedAnswer === currentQuestion.correctAnswer && (
                  <div className="flex items-center justify-center gap-2 text-yellow-600 mb-4">
                    <Star className="w-5 h-5" />
                    <span className="font-semibold">+10 XP • +5 Coins</span>
                  </div>
                )}
                {metacognitivePrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200"
                  >
                    <p className="text-lg text-blue-800 font-semibold mb-2">💭 Think about it:</p>
                    <p className="text-blue-700">{metacognitivePrompt}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-4xl mx-auto w-full mt-6">
        <button
          onClick={completeSession}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all"
        >
          End Session
        </button>
      </div>
    </div>
  )
}

