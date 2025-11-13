'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'

interface SurveyQuestion {
  id: string
  question: string
  type: 'scale' | 'multiple-choice'
  options?: string[]
}

const PRE_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'anxiety-1',
    question: 'How nervous do you feel when you see a math problem?',
    type: 'scale',
  },
  {
    id: 'anxiety-2',
    question: 'How worried are you about making mistakes in math?',
    type: 'scale',
  },
  {
    id: 'confidence-1',
    question: 'How confident do you feel about your math skills?',
    type: 'scale',
  },
  {
    id: 'enjoyment-1',
    question: 'How much do you enjoy doing math?',
    type: 'scale',
  },
]

export default function MathAnxietySurvey({ onComplete }: { onComplete: (results: any) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentAnswer, setCurrentAnswer] = useState(5)

  const handleAnswer = (value: number) => {
    setCurrentAnswer(value)
  }

  const handleNext = () => {
    const question = PRE_SURVEY_QUESTIONS[currentQuestion]
    setAnswers({ ...answers, [question.id]: currentAnswer })

    if (currentQuestion < PRE_SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer(5)
    } else {
      // Survey complete
      const results = {
        ...answers,
        [question.id]: currentAnswer,
        timestamp: Date.now(),
      }
      onComplete(results)
    }
  }

  const question = PRE_SURVEY_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / PRE_SURVEY_QUESTIONS.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {PRE_SURVEY_QUESTIONS.length}</span>
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
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-6">
            <Heart className="w-12 h-12 mx-auto text-pink-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {question.question}
            </h2>
            <p className="text-gray-600 text-sm">
              There are no right or wrong answers. Just tell us how you feel!
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>Not at all</span>
              <span>Very much</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={currentAnswer}
              onChange={(e) => handleAnswer(Number(e.target.value))}
              className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
            <div className="text-center mt-4">
              <span className="text-3xl font-bold text-primary-600">{currentAnswer}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {currentQuestion < PRE_SURVEY_QUESTIONS.length - 1 ? (
              <>
                Next <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              'Complete Survey'
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

