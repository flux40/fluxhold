'use client'

import { useState } from 'react'
import { ChatBubbleLeftRightIcon, XMarkIcon } from './Icons'

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'support', text: string }>>([
    { sender: 'support', text: 'Hello! Welcome to FluxHold Demo Support. How can I help you today?' },
    { sender: 'support', text: 'Remember: This is a demonstration platform only. No real financial transactions occur.' },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    setChatHistory(prev => [...prev, { sender: 'user', text: message }])
    setMessage('')
    
    // Auto-reply after 1 second
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        sender: 'support', 
        text: 'Thanks for your message! This is a demo customer support chat. For real inquiries, please contact your financial advisor.' 
      }])
    }, 1000)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-50"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold">FluxHold Support</h3>
              <p className="text-sm text-blue-100">Demo Support Chat</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-700 rounded"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.sender === 'user' ? 'text-right' : ''}`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.sender === 'support' ? 'Support Agent' : 'You'}
                </p>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Demo chat - responses are automated
            </p>
          </div>
        </div>
      )}
    </>
  )
}