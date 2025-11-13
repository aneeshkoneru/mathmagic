'use client'

import { useEffect, useRef } from 'react'

/**
 * Audio feedback component for multisensory learning
 * Plays sounds based on answer correctness
 */
export default function AudioFeedback({ 
  isCorrect, 
  playSound 
}: { 
  isCorrect: boolean | null
  playSound: boolean 
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!playSound || isCorrect === null) return

    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    if (isCorrect) {
      // Success sound - ascending tones
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } else {
      // Gentle error sound - soft tone
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    }

    return () => {
      audioContext.close()
    }
  }, [isCorrect, playSound])

  return null
}

