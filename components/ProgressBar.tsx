'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  max: number
  label?: string
  className?: string
}

export default function ProgressBar({ current, max, label, className = '' }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100))

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
        />
      </div>
    </div>
  )
}

