'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Coins, TrendingUp } from 'lucide-react'
import { useSessionStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function SessionComplete() {
  const { gameState, initializeSession } = useSessionStore()
  const router = useRouter()
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowSummary(true), 500)
  }, [])

  const sessionDuration = gameState.sessionData.endTime
    ? Math.round((gameState.sessionData.endTime - gameState.sessionData.startTime) / 1000 / 60)
    : 0

  const accuracy = gameState.sessionData.answers.length > 0
    ? (gameState.sessionData.answers.filter(a => a.correct).length / gameState.sessionData.answers.length) * 100
    : 0

  const handlePlayAgain = () => {
    initializeSession()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            Amazing Session!
          </h1>
          <p className="text-xl text-gray-600">
            You did great today!
          </p>
        </div>

        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Session Summary
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-3xl font-bold text-blue-700">{Math.round(accuracy)}%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Star className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <p className="text-3xl font-bold text-purple-700">{gameState.sessionData.answers.length}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <Coins className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-3xl font-bold text-green-700">{gameState.userProgress.coins}</p>
                <p className="text-sm text-gray-600">Coins Earned</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <p className="text-3xl font-bold text-yellow-700">{gameState.userProgress.level}</p>
                <p className="text-sm text-gray-600">Level</p>
              </div>
            </div>

            {gameState.userProgress.badges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">New Badges! 🏆</h3>
                <div className="flex gap-2">
                  {gameState.userProgress.badges.map((badge, idx) => (
                    <motion.div
                      key={badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3"
                    >
                      <Trophy className="w-6 h-6 text-white" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-center text-gray-600">
                <span className="font-semibold">Session Duration:</span> {sessionDuration} minutes
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAgain}
            className="flex-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xl font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Play Again!
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 mt-6"
        >
          Keep practicing to unlock more levels and badges! 🌟
        </motion.p>
      </motion.div>
    </div>
  )
}

