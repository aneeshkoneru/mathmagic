/**
 * Lightweight Engagement Tracker
 * Token-efficient eye tracking proxy using mouse movement, focus, and interaction patterns
 */

export interface EngagementMetrics {
  focusTime: number // milliseconds
  activeTime: number // milliseconds
  interactionCount: number
  mouseMovement: number // total distance
  attentionScore: number // 0-100
  engagementScore: number // 0-100
}

export interface EngagementSnapshot {
  timestamp: number
  isFocused: boolean
  mouseX: number
  mouseY: number
  hasInteraction: boolean
}

class EngagementTracker {
  private startTime: number = Date.now()
  private lastFocusTime: number = Date.now()
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 }
  private totalMouseDistance: number = 0
  private interactionCount: number = 0
  private isFocused: boolean = true
  private focusStartTime: number = Date.now()
  private totalFocusTime: number = 0
  private snapshots: EngagementSnapshot[] = []
  private lastSnapshotTime: number = 0
  private readonly SNAPSHOT_INTERVAL = 2000 // 2 seconds - token efficient
  private readonly MOUSE_THRESHOLD = 5 // pixels to count as movement

  constructor() {
    this.setupListeners()
  }

  private setupListeners() {
    // Focus/blur tracking
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => this.handleFocus())
      window.addEventListener('blur', () => this.handleBlur())
      document.addEventListener('visibilitychange', () => {
        document.hidden ? this.handleBlur() : this.handleFocus()
      })
    }
  }

  private handleFocus() {
    if (!this.isFocused) {
      this.isFocused = true
      this.focusStartTime = Date.now()
    }
  }

  private handleBlur() {
    if (this.isFocused) {
      this.isFocused = false
      this.totalFocusTime += Date.now() - this.focusStartTime
    }
  }

  // Track mouse movement (called from components)
  trackMouse(x: number, y: number) {
    const distance = Math.sqrt(
      Math.pow(x - this.lastMousePos.x, 2) + Math.pow(y - this.lastMousePos.y, 2)
    )

    if (distance > this.MOUSE_THRESHOLD) {
      this.totalMouseDistance += distance
      this.lastMousePos = { x, y }
    }

    // Take snapshot periodically
    const now = Date.now()
    if (now - this.lastSnapshotTime >= this.SNAPSHOT_INTERVAL) {
      this.snapshots.push({
        timestamp: now,
        isFocused: this.isFocused,
        mouseX: x,
        mouseY: y,
        hasInteraction: false,
      })
      this.lastSnapshotTime = now
      
      // Keep only last 30 snapshots (1 minute of data) - token efficient
      if (this.snapshots.length > 30) {
        this.snapshots.shift()
      }
    }
  }

  // Track interactions (clicks, keypresses, etc.)
  trackInteraction() {
    this.interactionCount++
    const now = Date.now()
    
    // Mark last snapshot as having interaction
    if (this.snapshots.length > 0) {
      this.snapshots[this.snapshots.length - 1].hasInteraction = true
    }
  }

  // Calculate engagement metrics
  getMetrics(): EngagementMetrics {
    const now = Date.now()
    const totalTime = now - this.startTime

    // Update focus time if currently focused
    let currentFocusTime = this.totalFocusTime
    if (this.isFocused) {
      currentFocusTime += now - this.focusStartTime
    }

    // Calculate attention score (0-100)
    const focusRatio = totalTime > 0 ? currentFocusTime / totalTime : 0
    const attentionScore = Math.min(100, focusRatio * 100)

    // Calculate engagement score
    // Factors: focus time (40%), interactions (30%), mouse movement (30%)
    const interactionRate = totalTime > 0 ? (this.interactionCount / (totalTime / 1000)) * 10 : 0
    const mouseActivity = Math.min(100, (this.totalMouseDistance / 1000) * 10) // normalize
    
    const engagementScore = Math.min(100,
      (attentionScore * 0.4) +
      (Math.min(100, interactionRate * 10) * 0.3) +
      (mouseActivity * 0.3)
    )

    return {
      focusTime: currentFocusTime,
      activeTime: totalTime,
      interactionCount: this.interactionCount,
      mouseMovement: this.totalMouseDistance,
      attentionScore: Math.round(attentionScore),
      engagementScore: Math.round(engagementScore),
    }
  }

  // Get compact snapshot data (token efficient)
  getSnapshots(): EngagementSnapshot[] {
    return this.snapshots
  }

  // Reset tracker
  reset() {
    this.startTime = Date.now()
    this.lastFocusTime = Date.now()
    this.lastMousePos = { x: 0, y: 0 }
    this.totalMouseDistance = 0
    this.interactionCount = 0
    this.isFocused = true
    this.focusStartTime = Date.now()
    this.totalFocusTime = 0
    this.snapshots = []
    this.lastSnapshotTime = 0
  }

  // Get engagement level (simple classification)
  getEngagementLevel(): 'high' | 'medium' | 'low' {
    const metrics = this.getMetrics()
    if (metrics.engagementScore >= 70) return 'high'
    if (metrics.engagementScore >= 40) return 'medium'
    return 'low'
  }
}

// Singleton instance
let trackerInstance: EngagementTracker | null = null

export function getEngagementTracker(): EngagementTracker {
  // Only create tracker on client side
  if (typeof window === 'undefined') {
    throw new Error('EngagementTracker can only be used on the client side')
  }
  
  if (!trackerInstance) {
    trackerInstance = new EngagementTracker()
  }
  return trackerInstance
}

// React hook for easy integration
export function useEngagementTracking() {
  if (typeof window === 'undefined') {
    // Return safe no-op functions for SSR
    return {
      trackMouse: () => {},
      trackInteraction: () => {},
      getMetrics: () => ({
        focusTime: 0,
        activeTime: 0,
        interactionCount: 0,
        mouseMovement: 0,
        attentionScore: 0,
        engagementScore: 0,
      }),
      getSnapshots: () => [],
      getEngagementLevel: () => 'low' as const,
      reset: () => {},
    }
  }

  try {
    const tracker = getEngagementTracker()

    return {
      trackMouse: (x: number, y: number) => {
        try {
          tracker.trackMouse(x, y)
        } catch (error) {
          console.error('Error in trackMouse:', error)
        }
      },
      trackInteraction: () => {
        try {
          tracker.trackInteraction()
        } catch (error) {
          console.error('Error in trackInteraction:', error)
        }
      },
      getMetrics: () => {
        try {
          return tracker.getMetrics()
        } catch (error) {
          console.error('Error in getMetrics:', error)
          return {
            focusTime: 0,
            activeTime: 0,
            interactionCount: 0,
            mouseMovement: 0,
            attentionScore: 0,
            engagementScore: 0,
          }
        }
      },
      getSnapshots: () => {
        try {
          return tracker.getSnapshots()
        } catch (error) {
          console.error('Error in getSnapshots:', error)
          return []
        }
      },
      getEngagementLevel: () => {
        try {
          return tracker.getEngagementLevel()
        } catch (error) {
          console.error('Error in getEngagementLevel:', error)
          return 'low' as const
        }
      },
      reset: () => {
        try {
          tracker.reset()
        } catch (error) {
          console.error('Error in reset:', error)
        }
      },
    }
  } catch (error) {
    console.error('Error initializing engagement tracker:', error)
    // Return safe no-op functions if tracker fails to initialize
    return {
      trackMouse: () => {},
      trackInteraction: () => {},
      getMetrics: () => ({
        focusTime: 0,
        activeTime: 0,
        interactionCount: 0,
        mouseMovement: 0,
        attentionScore: 0,
        engagementScore: 0,
      }),
      getSnapshots: () => [],
      getEngagementLevel: () => 'low' as const,
      reset: () => {},
    }
  }
}

