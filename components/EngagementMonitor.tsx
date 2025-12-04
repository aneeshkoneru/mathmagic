'use client'

import { useEffect, useRef } from 'react'
import { useEngagementTracking } from '@/lib/engagementTracker'
import { useSessionStore } from '@/lib/store'

/**
 * Lightweight engagement monitor component
 * Tracks user engagement and updates session data
 */
export default function EngagementMonitor() {
  const { trackMouse, trackInteraction, getMetrics, getSnapshots } = useEngagementTracking()
  const { logMouseEvent, saveEngagementData } = useSessionStore()
  const lastSaveTime = useRef(Date.now())
  const SAVE_INTERVAL = 10000 // Save every 10 seconds - token efficient

  useEffect(() => {
    // Track mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      trackMouse(e.clientX, e.clientY)
      // Also log to session store (existing functionality)
      logMouseEvent(e.clientX, e.clientY)
    }

    // Track interactions
    const handleInteraction = () => {
      trackInteraction()
    }

    // Save engagement data periodically
    const saveInterval = setInterval(() => {
      const metrics = getMetrics()
      const snapshots = getSnapshots()
      
      // Save compact snapshot data (token efficient - only essential info)
      saveEngagementData({
        ...metrics,
        snapshots: snapshots.map(s => ({
          timestamp: s.timestamp,
          isFocused: s.isFocused,
          hasInteraction: s.hasInteraction,
        })),
      })
      
      lastSaveTime.current = Date.now()
    }, SAVE_INTERVAL)

    // Attach event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('click', handleInteraction, { passive: true })
    window.addEventListener('keydown', handleInteraction, { passive: true })
    window.addEventListener('touchstart', handleInteraction, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      clearInterval(saveInterval)
      
      // Save final engagement data on unmount
      const finalMetrics = getMetrics()
      const finalSnapshots = getSnapshots()
      saveEngagementData({
        ...finalMetrics,
        snapshots: finalSnapshots.map(s => ({
          timestamp: s.timestamp,
          isFocused: s.isFocused,
          hasInteraction: s.hasInteraction,
        })),
      })
    }
  }, [trackMouse, trackInteraction, getMetrics, getSnapshots, logMouseEvent, saveEngagementData])

  // This component doesn't render anything - it's just for tracking
  return null
}

/**
 * Engagement Score Display Component (optional)
 * Shows current engagement level
 */
export function EngagementScoreDisplay() {
  const { getMetrics, getEngagementLevel } = useEngagementTracking()
  const [metrics, setMetrics] = useState(getMetrics())

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getMetrics())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const level = getEngagementLevel()
  const colorClass = 
    level === 'high' ? 'text-green-500' :
    level === 'medium' ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm z-50">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${colorClass.replace('text-', 'bg-')}`} />
        <span className="font-semibold">Engagement: {metrics.engagementScore}%</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {level === 'high' ? 'Highly Engaged' : level === 'medium' ? 'Moderately Engaged' : 'Low Engagement'}
      </div>
    </div>
  )
}

