import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SupportChatWrapper from '@/components/SupportChatWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FluxHold - AI Investment Platform',
  description: 'Experience AI-powered investment analytics in a risk-free environment.',
  keywords: ['AI investing', 'portfolio simulation', 'investment analytics',],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#060B14] text-white`}>
        {children}
        <SupportChatWrapper />
      </body>
    </html>
  )
}