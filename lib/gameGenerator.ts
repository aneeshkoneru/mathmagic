/**
 * Game Question Generator
 * Generates age-appropriate math questions based on difficulty level
 */

export interface Question {
  id: string
  type: 'addition' | 'subtraction' | 'number-recognition' | 'sequencing' | 'working-memory'
  question: string
  options: number[]
  correctAnswer: number
  visualAids?: string[]
  difficulty: number
}

/**
 * Generates a math question based on difficulty and type
 */
export function generateQuestion(
  difficulty: number,
  type: Question['type'],
  age?: number
): Question {
  const questionId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  switch (type) {
    case 'number-recognition':
      return generateNumberRecognition(questionId, difficulty, age)
    case 'addition':
      return generateAddition(questionId, difficulty, age)
    case 'subtraction':
      return generateSubtraction(questionId, difficulty, age)
    case 'sequencing':
      return generateSequencing(questionId, difficulty, age)
    case 'working-memory':
      return generateWorkingMemory(questionId, difficulty, age)
    default:
      return generateAddition(questionId, difficulty, age)
  }
}

function generateNumberRecognition(id: string, difficulty: number, age?: number): Question {
  // For very young children or low difficulty
  const maxNumber = Math.floor(difficulty / 10) + 5
  const correctAnswer = Math.floor(Math.random() * maxNumber) + 1

  const options = [correctAnswer]
  while (options.length < 4) {
    const option = Math.floor(Math.random() * maxNumber) + 1
    if (!options.includes(option)) {
      options.push(option)
    }
  }

  // Shuffle options
  options.sort(() => Math.random() - 0.5)

  return {
    id,
    type: 'number-recognition',
    question: `How many ${getEmojiForNumber(correctAnswer)} do you see?`,
    options,
    correctAnswer,
    difficulty,
    visualAids: [getEmojiForNumber(correctAnswer).repeat(correctAnswer)],
  }
}

function generateAddition(id: string, difficulty: number, age?: number): Question {
  const maxSum = Math.floor(difficulty / 2) + 10
  const a = Math.floor(Math.random() * (maxSum - 1)) + 1
  const b = Math.floor(Math.random() * (maxSum - a)) + 1
  const correctAnswer = a + b

  const options = [correctAnswer]
  while (options.length < 4) {
    const option = correctAnswer + Math.floor(Math.random() * 10) - 5
    if (option > 0 && !options.includes(option)) {
      options.push(option)
    }
  }

  options.sort(() => Math.random() - 0.5)

  return {
    id,
    type: 'addition',
    question: `What is ${a} + ${b}?`,
    options,
    correctAnswer,
    difficulty,
  }
}

function generateSubtraction(id: string, difficulty: number, age?: number): Question {
  const maxNumber = Math.floor(difficulty / 2) + 10
  const a = Math.floor(Math.random() * maxNumber) + 5
  const b = Math.floor(Math.random() * (a - 1)) + 1
  const correctAnswer = a - b

  const options = [correctAnswer]
  while (options.length < 4) {
    const option = correctAnswer + Math.floor(Math.random() * 10) - 5
    if (option >= 0 && !options.includes(option)) {
      options.push(option)
    }
  }

  options.sort(() => Math.random() - 0.5)

  return {
    id,
    type: 'subtraction',
    question: `What is ${a} - ${b}?`,
    options,
    correctAnswer,
    difficulty,
  }
}

function generateSequencing(id: string, difficulty: number, age?: number): Question {
  const sequenceLength = Math.floor(difficulty / 20) + 3
  const start = Math.floor(Math.random() * 10) + 1
  const step = Math.floor(Math.random() * 3) + 1

  const sequence: number[] = []
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(start + i * step)
  }

  const missingIndex = Math.floor(Math.random() * sequenceLength)
  const correctAnswer = sequence[missingIndex]
  sequence[missingIndex] = -1 // Mark as missing

  const options = [correctAnswer]
  while (options.length < 4) {
    const option = correctAnswer + Math.floor(Math.random() * 6) - 3
    if (option > 0 && !options.includes(option)) {
      options.push(option)
    }
  }

  options.sort(() => Math.random() - 0.5)

  const sequenceStr = sequence.map(n => n === -1 ? '?' : n).join(', ')

  return {
    id,
    type: 'sequencing',
    question: `What number comes next in this sequence: ${sequenceStr}?`,
    options,
    correctAnswer,
    difficulty,
  }
}

function generateWorkingMemory(id: string, difficulty: number, age?: number): Question {
  const sequenceLength = Math.floor(difficulty / 25) + 3
  const numbers: number[] = []
  for (let i = 0; i < sequenceLength; i++) {
    numbers.push(Math.floor(Math.random() * 9) + 1)
  }

  // Ask to recall the first or last number
  const recallPosition = Math.random() > 0.5 ? 0 : numbers.length - 1
  const correctAnswer = numbers[recallPosition]

  const options = [correctAnswer]
  while (options.length < 4) {
    const option = Math.floor(Math.random() * 9) + 1
    if (!options.includes(option)) {
      options.push(option)
    }
  }

  options.sort(() => Math.random() - 0.5)

  const position = recallPosition === 0 ? 'first' : 'last'

  return {
    id,
    type: 'working-memory',
    question: `Remember this sequence: ${numbers.join(', ')}. What was the ${position} number?`,
    options,
    correctAnswer,
    difficulty,
  }
}

function getEmojiForNumber(n: number): string {
  const emojis = ['🍎', '⭐', '🎈', '🎁', '🎮', '🏀', '🎨', '🚀', '🌈', '🎪']
  return emojis[n % emojis.length]
}

