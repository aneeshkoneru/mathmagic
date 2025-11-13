'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/lib/store'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Trophy, TrendingUp, Clock, Target } from 'lucide-react'

export default function Dashboard() {
  const { gameState } = useSessionStore()
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    // In a real app, fetch analytics from API
    const calculateAnalytics = () => {
      const answers = gameState.sessionData.answers
      if (answers.length === 0) return null

      const dailyData = answers.reduce((acc: any, answer, idx) => {
        const day = Math.floor(idx / 5) // Group every 5 questions
        if (!acc[day]) {
          acc[day] = { correct: 0, total: 0, day: `Day ${day + 1}` }
        }
        acc[day].total++
        if (answer.correct) acc[day].correct++
        return acc
      }, {})

      return {
        dailyData: Object.values(dailyData),
        totalQuestions: answers.length,
        correctAnswers: answers.filter(a => a.correct).length,
        averageTime: answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length,
        accuracy: (answers.filter(a => a.correct).length / answers.length) * 100,
      }
    }

    setAnalytics(calculateAnalytics())
  }, [gameState])

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available yet. Complete a session to see your progress!</p>
        </div>
      </div>
    )
  }

  const chartData = analytics.dailyData.map((d: any) => ({
    name: d.day,
    Accuracy: (d.correct / d.total) * 100,
    Questions: d.total,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Progress Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Level</p>
                <p className="text-3xl font-bold text-gray-800">{gameState.userProgress.level}</p>
              </div>
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Accuracy</p>
                <p className="text-3xl font-bold text-gray-800">{Math.round(analytics.accuracy)}%</p>
              </div>
              <Target className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Questions</p>
                <p className="text-3xl font-bold text-gray-800">{analytics.totalQuestions}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Time</p>
                <p className="text-3xl font-bold text-gray-800">{Math.round(analytics.averageTime / 1000)}s</p>
              </div>
              <Clock className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Accuracy Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Accuracy" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Questions Per Day</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Questions" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Badges */}
        {gameState.userProgress.badges.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Badges 🏆</h2>
            <div className="flex gap-4">
              {gameState.userProgress.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4"
                >
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

