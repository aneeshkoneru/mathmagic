'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Smile, Frown, Heart } from 'lucide-react'
import { useSessionStore } from '@/lib/store'

export default function MathFeelingSlider() {
  const { setPhase, updateMathFeeling } = useSessionStore()
  const [feeling, setFeeling] = useState(5)

  const handleContinue = () => {
    updateMathFeeling(feeling)
    setPhase('diagnostic')
  }

  const getEmoji = (value: number) => {
    if (value <= 3) return '😟'
    if (value <= 5) return '😐'
    if (value <= 7) return '🙂'
    return '😊'
  }

  const getColor = (value: number) => {
    if (value <= 3) return 'from-red-400 to-orange-400'
    if (value <= 5) return 'from-yellow-400 to-orange-400'
    if (value <= 7) return 'from-green-400 to-blue-400'
    return 'from-blue-400 to-purple-400'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          <Heart className="w-16 h-16 mx-auto text-pink-500" />
        </motion.div>

        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          How do you feel about math today?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          This helps us understand how you're feeling. There are no wrong answers!
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <motion.div
              key={feeling}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-8xl mb-4"
            >
              {getEmoji(feeling)}
            </motion.div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Not so good</span>
              <span>Great!</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={feeling}
              onChange={(e) => setFeeling(Number(e.target.value))}
              className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              style={{
                background: `linear-gradient(to right, ${getColor(feeling).split(' ')[0]} 0%, ${getColor(feeling).split(' ')[1]} 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`text-2xl font-bold bg-gradient-to-r ${getColor(feeling)} bg-clip-text text-transparent`}
          >
            {feeling <= 3 && "That's okay! We'll make math fun together!"}
            {feeling > 3 && feeling <= 5 && "Let's see how much fun we can have!"}
            {feeling > 5 && feeling <= 7 && "Great! You're ready for an adventure!"}
            {feeling > 7 && "Awesome! Let's have an amazing time learning!"}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xl font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  )
}

