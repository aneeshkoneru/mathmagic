import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SessionProvider from '@/components/SessionProvider'
import EngagementMonitor from '@/components/EngagementMonitor'

export const metadata: Metadata = {
  title: "Aneesh Koneru's Math Adventure - Learn Math with Fun!",
  description: 'AI-Native, Gamified Math App for Dyscalculia & Math Anxiety',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <EngagementMonitor />
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  )
}

