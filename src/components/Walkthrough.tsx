import React, { useState } from 'react';
import type { AIConfig, OSSettings } from '../types/os';
import { Sparkles, Smartphone, Monitor, Shield, ArrowRight, ArrowLeft, Check, Key, User, Moon } from 'lucide-react';
import logo from '../assets/logo.png';

interface WalkthroughProps {
  onComplete: (username: string, aiConfig: AIConfig, settings: OSSettings) => void;
  onSkip: () => void;
}

export const Walkthrough: React.FC<WalkthroughProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('Tritium Operator');
  const [themeSelection, setThemeSelection] = useState<'dark' | 'light' | 'crystal'>('crystal');
  const [connectAI, setConnectAI] = useState(true);
  
  const [aiProvider, setAIProvider] = useState<'openai' | 'anthropic' | 'google' | 'lmstudio' | 'ollama' | ''>('google');
  const [apiKey, setApiKey] = useState('');
  const [aiModel, setAIModel] = useState('gemini-1.5-flash');
  const [customUrl, setCustomUrl] = useState('');

  const handleProviderChange = (provider: 'openai' | 'anthropic' | 'google' | 'lmstudio' | 'ollama' | '') => {
    setAIProvider(provider);
    if (provider === 'openai') {
      setAIModel('gpt-4o');
      setCustomUrl('');
    } else if (provider === 'anthropic') {
      setAIModel('claude-3-5-sonnet');
      setCustomUrl('');
    } else if (provider === 'google') {
      setAIModel('gemini-1.5-flash');
      setCustomUrl('');
    } else if (provider === 'lmstudio') {
      setAIModel('local-model');
      setCustomUrl('http://localhost:1234');
    } else if (provider === 'ollama') {
      setAIModel('llama3');
      setCustomUrl('http://localhost:11434');
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleFinish = () => {
    const finalAI: AIConfig = connectAI ? {
      provider: aiProvider,
      apiKey: apiKey,
      model: aiModel,
      baseUrl: customUrl || undefined
    } : {
      provider: '',
      apiKey: '',
      model: ''
    };

    const finalSettings: OSSettings = {
      wallpaper: 'neon-waves',
      theme: themeSelection,
      blurAmount: 20,
      glowColor: '#06b6d4',
      fontSize: 14,
      safetyExitCode: 'TRITIUM-EXIT',
      useVirtualCursor: true
    };

    onComplete(username, finalAI, finalSettings);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2, 4, 8, 0.85)',
        backdropFilter: 'blur(15px)',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel-heavy"
        style={{
          width: '100%',
          maxWidth: '560px',
          borderRadius: '24px',
          overflow: 'hidden',
          animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Onboarding Header */}
        <div
          style={{
            padding: '24px 32px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logo} alt="Tritium" style={{ width: '32px', height: '32px' }} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Tritium Core Setup</h2>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                STEP {step} OF 4
              </span>
            </div>
          </div>
          <button
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Skip setup
          </button>
        </div>

        {/* Step Content */}
        <div style={{ padding: '32px', flex: 1, minHeight: '340px', overflowY: 'auto' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--glow-cyan)',
                  marginBottom: '8px',
                }}
              >
                <Sparkles size={36} style={{ color: 'var(--color-accent-cyan)' }} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Welcome to Tritium OS</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                A highly advanced, corporate-modern ecosystem shell built on top of Android, customized for the Google Pixel 10 Pro. Merges backend terminal intelligence with desktop productivity.
              </p>
              
              <div
                style={{
                  width: '100%',
                  marginTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  textAlign: 'left',
                }}
              >
                <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  Operator Nickname
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-accent-cyan)' }} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 42px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid var(--color-border-glass)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#f8fafc', marginBottom: '6px' }}>Configure Core AI Core</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
                  Tritium OS integrates a deep AI pipeline natively. Choose your AI provider (recommended) or set this up later.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="connectAI"
                    checked={connectAI}
                    onChange={(e) => setConnectAI(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-accent-cyan)' }}
                  />
                  <label htmlFor="connectAI" style={{ fontSize: '14px', color: '#f8fafc', cursor: 'pointer', fontWeight: 500 }}>
                    Enable system-wide AI services
                  </label>
                </div>

                {connectAI && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fade-in 0.3s ease' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        AI Core Provider
                      </label>
                      <select
                        value={aiProvider}
                        onChange={(e) => handleProviderChange(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid var(--color-border-glass)',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          outline: 'none',
                        }}
                      >
                        <option value="google">Google Gemini API (Default)</option>
                        <option value="openai">OpenAI (GPT-4o/3.5)</option>
                        <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                        <option value="lmstudio">LM Studio (Local Server)</option>
                        <option value="ollama">Ollama (Local Server)</option>
                      </select>
                    </div>

                    {/* API Key or Custom Endpoint URL */}
                    {['google', 'openai', 'anthropic'].includes(aiProvider) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                            API Access Key
                          </label>
                          <span style={{ fontSize: '11px', color: 'var(--color-accent-cyan)' }}>Saved locally</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <Key size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                          <input
                            type="password"
                            placeholder={`Enter your ${aiProvider.toUpperCase()} API key`}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '12px 12px 12px 38px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid var(--color-border-glass)',
                              borderRadius: '12px',
                              color: '#f8fafc',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            Server Endpoint URL
                          </label>
                          <input
                            type="text"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid var(--color-border-glass)',
                              borderRadius: '12px',
                              color: '#f8fafc',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Model Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        Default Model Instance
                      </label>
                      <input
                        type="text"
                        value={aiModel}
                        onChange={(e) => setAIModel(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid var(--color-border-glass)',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: '13px',
                          outline: 'none',
                          fontFamily: 'var(--font-mono)'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#f8fafc', marginBottom: '6px' }}>Style & Appearance</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                  Choose the default theme and aesthetic for Tritium OS. Can be customized later in Settings.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div
                  onClick={() => setThemeSelection('crystal')}
                  style={{
                    padding: '20px 12px',
                    borderRadius: '16px',
                    background: themeSelection === 'crystal' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                    border: `1.5px solid ${themeSelection === 'crystal' ? 'var(--color-accent-cyan)' : 'var(--color-border-glass)'}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition-smooth)',
                    boxShadow: themeSelection === 'crystal' ? 'var(--glow-cyan)' : 'none',
                  }}
                >
                  <Sparkles size={24} style={{ color: 'var(--color-accent-cyan)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc' }}>Neon Glass</div>
                </div>

                <div
                  onClick={() => setThemeSelection('dark')}
                  style={{
                    padding: '20px 12px',
                    borderRadius: '16px',
                    background: themeSelection === 'dark' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                    border: `1.5px solid ${themeSelection === 'dark' ? 'var(--color-accent-blue-bright)' : 'var(--color-border-glass)'}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition-smooth)',
                    boxShadow: themeSelection === 'dark' ? 'var(--glow-blue)' : 'none',
                  }}
                >
                  <Moon size={24} style={{ color: 'var(--color-accent-blue-bright)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc' }}>Deep Cyber</div>
                </div>

                <div
                  onClick={() => setThemeSelection('light')}
                  style={{
                    padding: '20px 12px',
                    borderRadius: '16px',
                    background: themeSelection === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.2)',
                    border: `1.5px solid ${themeSelection === 'light' ? '#f8fafc' : 'var(--color-border-glass)'}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  <User size={24} style={{ color: '#e2e8f0', marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc' }}>Minimal</div>
                </div>
              </div>

              <div
                className="glass-panel-light"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginTop: '12px'
                }}
              >
                <Shield size={24} style={{ color: 'var(--color-accent-cyan)' }} />
                <span>
                  The <strong>Neon Glass</strong> theme has an animated nebula backdrop and a real glassmorphic look matching your home server structure.
                </span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#f8fafc', marginBottom: '6px' }}>Essential UI Guide</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                  Please review these operational guidelines to smoothly navigate Tritium OS.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '6px', borderRadius: '8px', color: 'var(--color-accent-cyan)' }}>
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500 }}>System Layouts</h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                      Toggle between **Phone Mode** (a terminal-first Linux-style card environment) and **Desktop Mode** (floating resizeable workspace) via the system dock toggle.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '6px', borderRadius: '8px', color: 'var(--color-accent-blue-bright)' }}>
                    <Monitor size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500 }}>Peripherals & Virtual Pointer</h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                      Plugging in a physical keyboard & mouse triggers desktop mode instantly. In touch mode, dragging anywhere on screen acts as a responsive virtual trackpad.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '6px', borderRadius: '8px', color: 'var(--color-accent-purple)' }}>
                    <Shield size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500 }}>Safety Fallback Exit</h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                      In case of issues or to exit Tritium OS, simply <strong>click the Tritium logo 5 times rapidly</strong> in the top panel to force close the app shell and return to standard Android.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Onboarding Navigation Footer */}
        <div
          style={{
            padding: '20px 32px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {step > 1 ? (
            <button
              onClick={handlePrev}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: '1px solid var(--color-border-glass)',
                padding: '10px 18px',
                borderRadius: '12px',
                color: '#f8fafc',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'var(--transition-fast)',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--color-accent-cyan)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                color: '#020617',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
                boxShadow: 'var(--glow-cyan)',
                transition: 'var(--transition-smooth)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--color-accent-cyan)',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '12px',
                color: '#020617',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
                boxShadow: 'var(--glow-cyan)',
                transition: 'var(--transition-smooth)',
              }}
            >
              <Check size={16} />
              <span>Initialize Tritium</span>
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
