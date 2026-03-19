'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! 👋 I\'m the JRTools AI Assistant. Can I help you find the perfect tool today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'support' | 'product-search'>('support')
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          mode,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Sorry, there was an error: ${data.error}. Please try again or contact support at 1-800-JR-TOOLS.`,
            timestamp: new Date(),
          },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.response,
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--red)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(196, 18, 48, 0.3)',
          zIndex: 999,
          transition: 'all 0.3s ease',
        }}
        title="Chat with AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '100%',
            maxWidth: '400px',
            height: '500px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'var(--red)',
              color: 'white',
              padding: '16px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>🇺🇸 JRTools AI</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Mode Selector */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px 16px',
              borderBottom: '1px solid #e8e4dc',
              background: '#f9f7f4',
            }}
          >
            <button
              onClick={() => setMode('support')}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: mode === 'support' ? 'var(--red)' : '#e8e4dc',
                color: mode === 'support' ? 'white' : 'var(--navy)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Support
            </button>
            <button
              onClick={() => setMode('product-search')}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: mode === 'product-search' ? 'var(--red)' : '#e8e4dc',
                color: mode === 'product-search' ? 'white' : 'var(--navy)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              🔍 Find Tools
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: msg.role === 'user' ? 'var(--red)' : '#f0f0f0',
                    color: msg.role === 'user' ? 'white' : 'var(--navy)',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    wordWrap: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#f0f0f0',
                    color: 'var(--navy)',
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px',
              borderTop: '1px solid #e8e4dc',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d4a017',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'Barlow, sans-serif',
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: '8px 12px',
                background: isLoading ? '#ccc' : 'var(--red)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
