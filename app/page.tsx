'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/useSession'
import WelcomeScreen from '@/components/WelcomeScreen'
import MathFeelingSlider from '@/components/MathFeelingSlider'
import DiagnosticGame from '@/components/DiagnosticGame'
import LearningGame from '@/components/LearningGame'
import SessionComplete from '@/components/SessionComplete'
import { useSessionStore } from '@/lib/store'
import { Sparkles, BookOpen, Trophy, Target } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading: sessionLoading } = useSession()
  const { gameState, initializeSession } = useSessionStore()
  const currentPhase = gameState.currentPhase
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize session on mount
    initializeSession()
    setIsLoading(false)
  }, [initializeSession])

  // Show loading state
  if (sessionLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your adventure...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show landing page with sign up/sign in options
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-4xl w-full text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <div className="flex justify-center mb-6">
                <Sparkles className="w-20 h-20 text-purple-600" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                Math Adventure
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                AI-Native, Gamified Math App for Dyscalculia & Math Anxiety
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-md p-6">
                <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Learn at Your Pace</h3>
                <p className="text-gray-600">Adaptive learning that adjusts to your needs</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Gamified Experience</h3>
                <p className="text-gray-600">Earn badges, coins, and level up as you learn</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Progress</h3>
                <p className="text-gray-600">Monitor your improvement with detailed analytics</p>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg hover:shadow-xl"
              >
                Get Started - Sign Up
              </Link>
              <Link
                href="/auth/signin"
                className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-purple-600 hover:bg-purple-50 transition shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-8 text-gray-500 text-sm">
              Start your math learning journey today!
            </p>
          </div>
        </div>
      </main>
    )
  }

  // If authenticated, show the game
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {currentPhase === 'welcome' && <WelcomeScreen />}
      {currentPhase === 'feeling-check' && <MathFeelingSlider />}
      {currentPhase === 'diagnostic' && <DiagnosticGame />}
      {currentPhase === 'learning' && <LearningGame />}
      {currentPhase === 'complete' && <SessionComplete />}
    </main>
  )
}

