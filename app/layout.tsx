import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SessionProvider from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'Math Adventure - Learn Math with Fun!',
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
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  )
}

