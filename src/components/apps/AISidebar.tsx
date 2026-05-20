import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, X, HelpCircle, Bot } from 'lucide-react';
import type { AIConfig } from '../../types/os';

interface Message {
  text: string;
  isUser: boolean;
}

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  aiConfig: AIConfig;
}

export const AISidebar: React.FC<AISidebarProps> = ({
  isOpen,
  onClose,
  aiConfig,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! I am your Tritium Intelligent Assistant. I am plugged directly into your system core. How can I help you operate today?', isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    const query = input.trim();
    if (!query) return;

    const newMsgs = [...messages, { text: query, isUser: true }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    try {
      let resultText = '';
      if (!aiConfig.provider) {
        resultText = `[Tritium Local Node Core]: Standing by. Please configure an API authorization key in Settings to activate live LLM assistant capabilities. Currently, I can simulate system parameters or answers to requests such as: "${query}".`;
      } else {
        if (aiConfig.provider === 'google') {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiConfig.apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }],
              }),
            }
          );
          const data = await response.json();
          resultText = data.candidates[0].content.parts[0].text;
        } else if (aiConfig.provider === 'openai') {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${aiConfig.apiKey}`,
            },
            body: JSON.stringify({
              model: aiConfig.model,
              messages: [{ role: 'user', content: query }],
            }),
          });
          const data = await response.json();
          resultText = data.choices[0].message.content;
        } else if (aiConfig.provider === 'anthropic') {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': aiConfig.apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: aiConfig.model,
              messages: [{ role: 'user', content: query }],
              max_tokens: 500,
            }),
          });
          const data = await response.json();
          resultText = data.content[0].text;
        }
      }
      setMessages((prev) => [...prev, { text: resultText, isUser: false }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { text: `Error linking to AI pipeline: ${e.message || 'Check credentials.'}`, isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (sug: string) => {
    setInput(sug);
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '320px',
        zIndex: 8900,
        background: 'rgba(5, 10, 24, 0.82)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderLeft: '1px solid rgba(6, 182, 212, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
        animation: 'slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Apple-Intelligence Neon glowing edge overlay */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, #06b6d4, #2563eb, #8b5cf6, #06b6d4)',
          opacity: 0.8,
          boxShadow: '0 0 10px #06b6d4',
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot size={18} style={{ color: 'var(--color-accent-cyan)' }} />
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', fontFamily: 'var(--font-title)' }}>
            Tritium Intelligence
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          padding: '20px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: m.isUser ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: m.isUser ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
              padding: '12px 16px',
              borderRadius: m.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              color: m.isUser ? '#f8fafc' : '#cbd5e1',
              fontSize: '13px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
            }}
          >
            {m.text}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
            <RefreshCw size={12} className="spinning-icon" />
            <span>Analyzing system vectors...</span>
          </div>
        )}
        <div ref={scrollEndRef} />
      </div>

      {/* Suggested prompts list */}
      {messages.length === 1 && (
        <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HelpCircle size={10} />
            <span>SUGGESTED VECTORS:</span>
          </span>
          {['How do I write a custom bash script?', 'Help me design a glassmorphic color palette.', 'What are Google Pixel 10 Pro Tensor specs?'].map((sug) => (
            <button
              key={sug}
              onClick={() => handleSuggestionClick(sug)}
              style={{
                textAlign: 'left',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: 'var(--color-text-secondary)',
                fontSize: '11px',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <div
        style={{
          padding: '16px 24px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '12px',
            padding: '8px 14px',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Engage coprocessor..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '13px',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent-cyan)',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinning-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
export default AISidebar;
