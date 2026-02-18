// This wrapper ensures SupportChat is only imported in client components
'use client'

import dynamic from 'next/dynamic'

// Dynamically import SupportChat to avoid SSR issues
const SupportChat = dynamic(() => import('./SupportChat'), {
  ssr: false,
})

export default function SupportChatWrapper() {
  return <SupportChat />
}