# Engagement Tracking System

## Overview

A lightweight, token-efficient eye tracking proxy system that monitors user engagement through mouse movement, focus patterns, and interaction data.

## Features

- **Token Efficient**: Only stores essential data points (snapshots every 2 seconds, max 30 snapshots)
- **Lightweight**: Minimal performance impact with passive event listeners
- **Real-time Metrics**: Calculates engagement and attention scores
- **Automatic Tracking**: Works automatically when `EngagementMonitor` is included in layout

## How It Works

### Metrics Tracked

1. **Focus Time**: Time window is in focus (not minimized/background)
2. **Active Time**: Total session duration
3. **Interaction Count**: Clicks, keypresses, touches
4. **Mouse Movement**: Total distance traveled (pixel-based)
5. **Attention Score**: Percentage of time focused (0-100)
6. **Engagement Score**: Composite score (0-100) based on:
   - Focus time: 40%
   - Interactions: 30%
   - Mouse movement: 30%

### Data Collection

- **Snapshots**: Taken every 2 seconds
- **Storage**: Maximum 30 snapshots (1 minute of data)
- **Save Interval**: Engagement data saved to store every 10 seconds
- **Final Save**: Engagement data saved on component unmount

## Usage

### Automatic (Recommended)

The `EngagementMonitor` component is already included in the root layout and tracks automatically.

### Manual Usage

```typescript
import { useEngagementTracking } from '@/lib/engagementTracker'

function MyComponent() {
  const { 
    trackMouse, 
    trackInteraction, 
    getMetrics, 
    getEngagementLevel 
  } = useEngagementTracking()

  // Track mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    trackMouse(e.clientX, e.clientY)
  }

  // Track interactions
  const handleClick = () => {
    trackInteraction()
  }

  // Get current metrics
  const metrics = getMetrics()
  console.log('Engagement Score:', metrics.engagementScore)
  console.log('Attention Score:', metrics.attentionScore)

  // Get engagement level
  const level = getEngagementLevel() // 'high' | 'medium' | 'low'
}
```

### Accessing Engagement Data

```typescript
import { useSessionStore } from '@/lib/store'

function MyComponent() {
  const { gameState } = useSessionStore()
  const engagement = gameState.sessionData.engagement

  if (engagement) {
    console.log('Engagement Score:', engagement.engagementScore)
    console.log('Focus Time:', engagement.focusTime)
    console.log('Interactions:', engagement.interactionCount)
  }
}
```

## Engagement Levels

- **High**: Engagement score ≥ 70%
- **Medium**: Engagement score 40-69%
- **Low**: Engagement score < 40%

## Token Efficiency

The system is designed to be token-efficient:

1. **Limited Snapshots**: Only 30 snapshots stored (1 minute of data)
2. **Compact Data**: Snapshots only store essential info (timestamp, focus state, interaction flag)
3. **Throttled Updates**: Mouse tracking only logs significant movements (>5 pixels)
4. **Periodic Saves**: Data saved every 10 seconds, not on every event

## Dashboard Integration

Engagement scores are automatically displayed in the dashboard:
- Engagement Score card shows overall engagement percentage
- Attention Score shown as subtitle
- Data updates as user plays

## Performance

- Uses passive event listeners for optimal performance
- Minimal memory footprint
- No impact on game performance
- Automatic cleanup on component unmount

