/**
 * Adaptive Learning Algorithm
 * Simulates Dynamic Bayesian Network for real-time skill assessment and difficulty adjustment
 */

export interface SkillEstimate {
  workingMemory: number
  attention: number
  processingSpeed: number
  executiveFunction: number
  mathFluency: number
  confidence: number // How confident we are in the estimate
}

export interface PerformanceMetrics {
  correctAnswers: number
  totalAnswers: number
  averageResponseTime: number
  attentionScore: number
  recentPerformance: Array<{ correct: boolean; timeSpent: number }>
}

/**
 * Updates skill estimate based on performance
 * Uses a simplified Bayesian update approach
 */
export function updateSkillEstimate(
  currentEstimate: SkillEstimate,
  metrics: PerformanceMetrics
): SkillEstimate {
  const accuracy = metrics.correctAnswers / Math.max(1, metrics.totalAnswers)
  const speedFactor = Math.max(0, Math.min(1, 1 - metrics.averageResponseTime / 10000)) // Normalize to 10s max

  // Weighted update based on performance
  const performanceScore = (accuracy * 0.6 + speedFactor * 0.4) * 100

  // Update math fluency with exponential moving average
  const alpha = 0.3 // Learning rate
  const newMathFluency = currentEstimate.mathFluency * (1 - alpha) + performanceScore * alpha

  // Update confidence based on number of observations
  const newConfidence = Math.min(1, currentEstimate.confidence + 0.1)

  return {
    ...currentEstimate,
    mathFluency: newMathFluency,
    confidence: newConfidence,
  }
}

/**
 * Calculates optimal difficulty level based on skill estimate
 * Uses zone of proximal development (ZPD) principle
 */
export function calculateOptimalDifficulty(skillEstimate: SkillEstimate): number {
  // Target difficulty should be slightly above current skill (ZPD)
  const targetDifficulty = skillEstimate.mathFluency * 1.1

  // Clamp to valid range
  return Math.max(10, Math.min(95, targetDifficulty))
}

/**
 * Generates next question parameters based on current skill and performance
 */
export function generateQuestionParameters(
  skillEstimate: SkillEstimate,
  recentPerformance: PerformanceMetrics['recentPerformance']
): {
  difficulty: number
  timeLimit?: number
  questionType: 'addition' | 'subtraction' | 'number-recognition' | 'sequencing'
  numOptions: number
} {
  const optimalDifficulty = calculateOptimalDifficulty(skillEstimate)

  // Analyze recent performance to adjust
  const recentAccuracy = recentPerformance.length > 0
    ? recentPerformance.filter(p => p.correct).length / recentPerformance.length
    : 0.5

  // Adjust difficulty based on recent performance
  let adjustedDifficulty = optimalDifficulty
  if (recentAccuracy > 0.8) {
    adjustedDifficulty += 5 // Too easy, increase
  } else if (recentAccuracy < 0.5) {
    adjustedDifficulty -= 5 // Too hard, decrease
  }

  // Determine question type based on skill level
  let questionType: 'addition' | 'subtraction' | 'number-recognition' | 'sequencing'
  if (adjustedDifficulty < 30) {
    questionType = 'number-recognition'
  } else if (adjustedDifficulty < 50) {
    questionType = 'addition'
  } else if (adjustedDifficulty < 70) {
    questionType = 'subtraction'
  } else {
    questionType = 'sequencing'
  }

  // Set time limit based on processing speed
  const baseTime = 15000 // 15 seconds base
  const timeLimit = baseTime * (1 + skillEstimate.processingSpeed / 100)

  return {
    difficulty: Math.max(10, Math.min(95, adjustedDifficulty)),
    timeLimit: Math.max(5000, Math.min(30000, timeLimit)),
    questionType,
    numOptions: adjustedDifficulty < 50 ? 4 : 6,
  }
}

/**
 * Initializes skill estimate from diagnostic results
 */
export function initializeFromDiagnostic(diagnostic: {
  workingMemory: number
  attention: number
  processingSpeed: number
  executiveFunction: number
}): SkillEstimate {
  // Average cognitive skills to estimate initial math fluency
  const initialMathFluency =
    (diagnostic.workingMemory * 0.3 +
      diagnostic.attention * 0.2 +
      diagnostic.processingSpeed * 0.3 +
      diagnostic.executiveFunction * 0.2)

  return {
    workingMemory: diagnostic.workingMemory,
    attention: diagnostic.attention,
    processingSpeed: diagnostic.processingSpeed,
    executiveFunction: diagnostic.executiveFunction,
    mathFluency: initialMathFluency,
    confidence: 0.5, // Moderate confidence from diagnostic
  }
}

