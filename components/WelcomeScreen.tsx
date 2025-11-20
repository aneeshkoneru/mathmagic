'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Trophy, Star } from 'lucide-react'
import { useSessionStore } from '@/lib/store'
import ProgressBar from './ProgressBar'

export default function WelcomeScreen() {
  const { setPhase, gameState } = useSessionStore()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleStart = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setPhase('feeling-check')
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="mb-6"
        >
          <Sparkles className="w-24 h-24 mx-auto text-primary-500" />
        </motion.div>

        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Aneesh Koneru's Math Adventure! 🎮
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Let's learn math together in a fun way!
        </p>

        {gameState.userProgress.level > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6 p-4 bg-white rounded-lg shadow-md"
          >
            <div className="flex items-center justify-center gap-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="text-left">
                <p className="font-semibold">Level {gameState.userProgress.level}</p>
                <p className="text-sm text-gray-600">
                  {gameState.userProgress.coins} coins • {gameState.userProgress.badges.length} badges
                </p>
              </div>
            </div>
            <ProgressBar
              current={gameState.userProgress.xp % 100}
              max={100}
              label="XP"
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={isAnimating}
          className="bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xl font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isAnimating ? 'Starting...' : 'Start Your Adventure!'}
        </motion.button>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 flex justify-center gap-4"
        >
          <Star className="w-6 h-6 text-yellow-400" />
          <Star className="w-6 h-6 text-yellow-400" />
          <Star className="w-6 h-6 text-yellow-400" />
        </motion.div>
      </motion.div>
    </div>
  )
}

