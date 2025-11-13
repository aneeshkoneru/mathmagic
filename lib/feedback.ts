/**
 * AI Feedback and Metacognitive Prompts
 * Provides encouraging, adaptive feedback to build confidence and support learning
 */

export interface FeedbackMessage {
  message: string
  emoji: string
  type: 'encouragement' | 'strategy' | 'celebration' | 'support'
}

const ENCOURAGEMENT_MESSAGES = [
  { message: "You're doing great! Keep going!", emoji: "🌟", type: 'encouragement' as const },
  { message: "I can see you're thinking carefully!", emoji: "💭", type: 'encouragement' as const },
  { message: "Every problem you solve makes you stronger!", emoji: "💪", type: 'encouragement' as const },
  { message: "You're learning something new with each question!", emoji: "🎓", type: 'encouragement' as const },
  { message: "I'm proud of your effort!", emoji: "👏", type: 'encouragement' as const },
]

const STRATEGY_MESSAGES = [
  { message: "Try counting on your fingers or drawing it out!", emoji: "✋", type: 'strategy' as const },
  { message: "Take your time - there's no rush!", emoji: "⏰", type: 'strategy' as const },
  { message: "Can you break this problem into smaller parts?", emoji: "🧩", type: 'strategy' as const },
  { message: "What strategy did you use? That's great thinking!", emoji: "🤔", type: 'strategy' as const },
  { message: "Remember, mistakes help us learn!", emoji: "💡", type: 'strategy' as const },
]

const CELEBRATION_MESSAGES = [
  { message: "Amazing! You got it right!", emoji: "🎉", type: 'celebration' as const },
  { message: "Fantastic work! You're a math star!", emoji: "⭐", type: 'celebration' as const },
  { message: "Wow! You're getting really good at this!", emoji: "🚀", type: 'celebration' as const },
  { message: "Perfect! Keep up the excellent work!", emoji: "🏆", type: 'celebration' as const },
  { message: "Incredible! You're learning so fast!", emoji: "✨", type: 'celebration' as const },
]

const SUPPORT_MESSAGES = [
  { message: "That's okay! Math can be tricky. Let's try again!", emoji: "💙", type: 'support' as const },
  { message: "You're brave for trying! That's what matters most!", emoji: "🦸", type: 'support' as const },
  { message: "Everyone makes mistakes - that's how we learn!", emoji: "🌱", type: 'support' as const },
  { message: "You're doing your best, and that's amazing!", emoji: "💫", type: 'support' as const },
  { message: "I believe in you! You can do this!", emoji: "🤗", type: 'support' as const },
]

/**
 * Generates feedback based on answer correctness and context
 */
export function generateFeedback(
  isCorrect: boolean,
  timeSpent: number,
  consecutiveCorrect: number,
  mathFeelingScore?: number
): FeedbackMessage {
  if (isCorrect) {
    if (consecutiveCorrect >= 3) {
      return CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]
    }
    return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  } else {
    // If user has low math feeling score, provide extra support
    if (mathFeelingScore && mathFeelingScore <= 5) {
      return SUPPORT_MESSAGES[Math.floor(Math.random() * SUPPORT_MESSAGES.length)]
    }
    return STRATEGY_MESSAGES[Math.floor(Math.random() * STRATEGY_MESSAGES.length)]
  }
}

/**
 * Generates metacognitive reflection prompts
 */
export function generateMetacognitivePrompt(
  questionType: string,
  wasCorrect: boolean
): string {
  const prompts = {
    'addition': [
      "What helped you solve this addition problem?",
      "Did you count, use your fingers, or think of it another way?",
      "How did you figure out the answer?",
    ],
    'subtraction': [
      "What strategy did you use for this subtraction?",
      "Did you count backwards or think of it as 'taking away'?",
      "How did you solve this?",
    ],
    'sequencing': [
      "What pattern did you notice in this sequence?",
      "How did you figure out what comes next?",
      "What helped you solve this?",
    ],
    'working-memory': [
      "How did you remember the numbers?",
      "Did you repeat them in your head or use another trick?",
      "What helped you remember?",
    ],
  }

  const typePrompts = prompts[questionType as keyof typeof prompts] || prompts['addition']
  return typePrompts[Math.floor(Math.random() * typePrompts.length)]
}

/**
 * Generates adaptive encouragement based on performance trends
 */
export function generateAdaptiveEncouragement(
  recentAccuracy: number,
  trend: 'improving' | 'stable' | 'declining'
): FeedbackMessage {
  if (trend === 'improving') {
    return {
      message: "You're getting better and better! I can see your improvement!",
      emoji: "📈",
      type: 'celebration',
    }
  } else if (trend === 'declining' && recentAccuracy < 0.5) {
    return {
      message: "These problems are getting harder, but you're still trying - that's what matters!",
      emoji: "💪",
      type: 'support',
    }
  } else {
    return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  }
}

