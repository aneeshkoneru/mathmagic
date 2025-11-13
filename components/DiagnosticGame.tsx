'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionStore } from '@/lib/store'
import { generateQuestion } from '@/lib/gameGenerator'

interface DiagnosticTask {
  type: 'working-memory' | 'attention' | 'processing-speed'
  question: ReturnType<typeof generateQuestion>
  startTime: number
  completed: boolean
  score: number
}

export default function DiagnosticGame() {
  const { setPhase, updateDiagnosticResult, setCurrentGameType } = useSessionStore()
  const [currentTask, setCurrentTask] = useState(0)
  const [tasks, setTasks] = useState<DiagnosticTask[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Initialize diagnostic tasks
    const taskTypes: DiagnosticTask['type'][] = ['working-memory', 'attention', 'processing-speed']
    const newTasks = taskTypes.map((type) => ({
      type,
      question: generateQuestion(30, type === 'working-memory' ? 'working-memory' : 'addition'),
      startTime: Date.now(),
      completed: false,
      score: 0,
    }))
    setTasks(newTasks)
    setCurrentGameType('working-memory')
  }, [setCurrentGameType])

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answer)
    const task = tasks[currentTask]
    const isCorrect = answer === task.question.correctAnswer
    const timeSpent = Date.now() - task.startTime

    // Calculate score based on correctness and speed
    let score = 0
    if (isCorrect) {
      const speedBonus = Math.max(0, 1 - timeSpent / 10000) // Bonus for fast answers
      score = 50 + speedBonus * 50
    } else {
      score = Math.max(0, 20 - timeSpent / 500) // Partial credit for trying
    }

    const updatedTasks = [...tasks]
    updatedTasks[currentTask] = {
      ...task,
      completed: true,
      score,
    }
    setTasks(updatedTasks)
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)

      if (currentTask < tasks.length - 1) {
        setCurrentTask(currentTask + 1)
        const nextType = updatedTasks[currentTask + 1]?.type
        if (nextType === 'working-memory') setCurrentGameType('working-memory')
        else if (nextType === 'attention') setCurrentGameType('attention')
      } else {
        completeDiagnostic()
      }
    }, 2000)
  }

  const completeDiagnostic = () => {
    // Calculate diagnostic results
    const workingMemoryTask = tasks.find(t => t.type === 'working-memory')
    const attentionTask = tasks.find(t => t.type === 'attention')
    const speedTask = tasks.find(t => t.type === 'processing-speed')

    const workingMemory = workingMemoryTask?.score || 50
    const attention = attentionTask?.score || 50
    const processingSpeed = speedTask?.score || 50
    const executiveFunction = (workingMemory + attention) / 2 // Simplified
    const estimatedSkillLevel = (workingMemory + attention + processingSpeed + executiveFunction) / 4

    updateDiagnosticResult({
      workingMemory,
      attention,
      processingSpeed,
      executiveFunction,
      estimatedSkillLevel,
    })

    setIsComplete(true)
    setTimeout(() => {
      setPhase('learning')
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Great job!</h2>
          <p className="text-lg text-gray-600">Starting your personalized learning...</p>
        </motion.div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your games...</p>
        </div>
      </div>
    )
  }

  const task = tasks[currentTask]
  const progress = ((currentTask + 1) / tasks.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Game {currentTask + 1} of {tasks.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full"
            />
          </div>
        </div>

        <motion.div
          key={currentTask}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {task.type === 'working-memory' && '🧠 Memory Challenge'}
            {task.type === 'attention' && '👀 Attention Game'}
            {task.type === 'processing-speed' && '⚡ Speed Challenge'}
          </h2>

          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xl text-gray-700 mb-8 text-center min-h-[60px]">
                  {task.question.question}
                </p>

                {task.question.visualAids && (
                  <div className="text-4xl text-center mb-6">
                    {task.question.visualAids[0]}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {task.question.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={`p-6 rounded-xl text-2xl font-bold transition-all ${
                        selectedAnswer === option
                          ? option === task.question.correctAnswer
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
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
                className="text-center"
              >
                <div className="text-6xl mb-4">
                  {selectedAnswer === task.question.correctAnswer ? '🎉' : '💪'}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {selectedAnswer === task.question.correctAnswer
                    ? 'Excellent!'
                    : 'Good try! Keep going!'}
                </h3>
                <p className="text-gray-600">
                  {selectedAnswer === task.question.correctAnswer
                    ? "You're doing great!"
                    : 'The correct answer was ' + task.question.correctAnswer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

