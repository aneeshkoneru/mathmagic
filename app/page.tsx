'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WelcomeScreen from '@/components/WelcomeScreen'
import MathFeelingSlider from '@/components/MathFeelingSlider'
import DiagnosticGame from '@/components/DiagnosticGame'
import LearningGame from '@/components/LearningGame'
import SessionComplete from '@/components/SessionComplete'
import { useSessionStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const { currentPhase, initializeSession } = useSessionStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize session on mount
    initializeSession()
    setIsLoading(false)
  }, [initializeSession])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your adventure...</p>
        </div>
      </div>
    )
  }

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

