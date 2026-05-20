import React, { useState } from 'react';
import { Key, Shield, User, Sliders, Cpu, Battery, HardDrive, Check } from 'lucide-react';
import type { OSSettings, AIConfig } from '../../types/os';

interface SettingsAppProps {
  settings: OSSettings;
  setSettings: React.Dispatch<React.SetStateAction<OSSettings>>;
  aiConfig: AIConfig;
  setAIConfig: (config: AIConfig) => void;
  username: string;
  setUsername: (name: string) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  setSettings,
  aiConfig,
  setAIConfig,
  username,
  setUsername,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'ai' | 'security'>('profile');

  // AI config states for customization
  const [tempKey, setTempKey] = useState(aiConfig.apiKey);
  const [tempProvider, setTempProvider] = useState(aiConfig.provider);
  const [tempModel, setTempModel] = useState(aiConfig.model);

  const saveAIConfig = () => {
    setAIConfig({
      provider: tempProvider,
      apiKey: tempKey,
      model: tempModel,
    });
    alert('AI configurations saved locally.');
  };

  const handleWallpaperChange = (wp: string) => {
    setSettings((prev) => ({ ...prev, wallpaper: wp }));
  };

  const handleBlurChange = (val: number) => {
    setSettings((prev) => ({ ...prev, blurAmount: val }));
  };

  const handleGlowColorChange = (color: string) => {
    setSettings((prev) => ({ ...prev, glowColor: color }));
  };

  const handleFontSizeChange = (sz: number) => {
    setSettings((prev) => ({ ...prev, fontSize: sz }));
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#040814',
        color: '#f8fafc',
      }}
    >
      {/* Settings Navigation Sidebar */}
      <div
        style={{
          width: '180px',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'rgba(0,0,0,0.15)',
        }}
      >
        <button
          onClick={() => setActiveTab('profile')}
          style={activeTab === 'profile' ? activeTabStyle : inactiveTabStyle}
        >
          <User size={14} />
          <span>Operator Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          style={activeTab === 'appearance' ? activeTabStyle : inactiveTabStyle}
        >
          <Sliders size={14} />
          <span>Appearance</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          style={activeTab === 'ai' ? activeTabStyle : inactiveTabStyle}
        >
          <Key size={14} />
          <span>AI Pipeline</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={activeTab === 'security' ? activeTabStyle : inactiveTabStyle}
        >
          <Shield size={14} />
          <span>System Security</span>
        </button>

        {/* Dynamic Hardware Widget in Sidebar */}
        <div
          style={{
            marginTop: 'auto',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Cpu size={12} style={{ color: 'var(--color-accent-cyan)' }} />
            <span>TENSOR G5: OK</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Battery size={12} style={{ color: '#10b981' }} />
            <span>BATTERY: 87%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <HardDrive size={12} style={{ color: 'var(--color-accent-purple)' }} />
            <span>DRIVE: 156GB F</span>
          </div>
        </div>
      </div>

      {/* Settings Main Content Area */}
      <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '6px' }}>Operator Profile Settings</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Identity details that manage system titles, directories, and personalized shell outputs.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Operator Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div
              className="glass-panel-light"
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5',
              }}
            >
              <strong>System Workspace:</strong> c:\Users\operator\TritiumOS_Workspace is active. System assets link directly to this profile structure. Change username to update paths.
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div>
              <h2 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '6px' }}>Aesthetic Customizer Suite</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Tweak desktop theme tokens, blur values, and wall canvases to fit your workplace.
              </p>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

            {/* Accent colors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>System Neon Accent Glow</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleGlowColorChange(color)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: color,
                      border: settings.glowColor === color ? '2px solid #f8fafc' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      boxShadow: settings.glowColor === color ? `0 0 10px ${color}` : 'none',
                      transition: 'transform 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {settings.glowColor === color && <Check size={14} style={{ color: color === '#ffffff' ? '#000000' : '#ffffff' }} />}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

            {/* Backdrop Blur slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Backdrop Glass Blur</span>
                <span style={{ color: 'var(--color-accent-cyan)' }}>{settings.blurAmount}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={settings.blurAmount}
                onChange={(e) => handleBlurChange(parseInt(e.target.value))}
                style={{
                  cursor: 'pointer',
                  accentColor: 'var(--color-accent-cyan)',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.05)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

            {/* Virtual Cursor Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '300px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Virtual Trackpad Mouse</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Enables a physical pointer tracked by touch coordinates.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.useVirtualCursor}
                onChange={(e) => setSettings((prev) => ({ ...prev, useVirtualCursor: e.target.checked }))}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: 'var(--color-accent-cyan)',
                  cursor: 'pointer',
                }}
              />
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

            {/* Font size selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Core Font Sizing</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[12, 14, 16, 18].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '8px',
                      background: settings.fontSize === size ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${settings.fontSize === size ? 'var(--color-accent-cyan)' : 'var(--color-border-glass)'}`,
                      color: settings.fontSize === size ? 'var(--color-accent-cyan)' : '#f8fafc',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    {size === 12 && 'Compact'}
                    {size === 14 && 'Normal'}
                    {size === 16 && 'Large'}
                    {size === 18 && 'Enterprise'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

            {/* Wallpaper Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>System Wallpaper Dynamic Canvas</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', maxWidth: '480px' }}>
                {['neon-waves', 'obsidian-nebula', 'solid-deep'].map((wp) => (
                  <button
                    key={wp}
                    onClick={() => handleWallpaperChange(wp)}
                    style={{
                      height: '60px',
                      borderRadius: '12px',
                      border: settings.wallpaper === wp ? '2px solid var(--color-accent-cyan)' : '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#f8fafc',
                      background: wp === 'neon-waves'
                        ? 'radial-gradient(circle, #0b152d 0%, #030712 100%)'
                        : wp === 'obsidian-nebula'
                        ? 'radial-gradient(circle, #1e0b36 0%, #030712 100%)'
                        : '#020408',
                      boxShadow: settings.wallpaper === wp ? 'var(--glow-cyan)' : 'none',
                    }}
                  >
                    {wp.toUpperCase().replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '6px' }}>AI Pipeline Hub</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Securely register models or keys to integrate assistants directly across terminal, browser, and document views.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Active Model Pipeline</label>
                <select
                  value={tempProvider}
                  onChange={(e) => setTempProvider(e.target.value as any)}
                  style={inputStyle}
                >
                  <option value="">None (Mock Pipeline Simulator)</option>
                  <option value="google">Google Gemini API</option>
                  <option value="openai">OpenAI Pipeline</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="lmstudio">LM Studio (Local)</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>

              {tempProvider !== '' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {['lmstudio', 'ollama'].includes(tempProvider) ? 'Local Server Endpoint URL' : 'API Access Authentication Key'}
                    </label>
                    <input
                      type={['lmstudio', 'ollama'].includes(tempProvider) ? 'text' : 'password'}
                      placeholder={['lmstudio', 'ollama'].includes(tempProvider) ? 'http://localhost:11434' : 'Enter API authorization key'}
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Model Identifier Name</label>
                    <input
                      type="text"
                      value={tempModel}
                      onChange={(e) => setTempModel(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              <button
                onClick={saveAIConfig}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '8px',
                  background: 'var(--color-accent-cyan)',
                  border: 'none',
                  color: '#020617',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: 'var(--glow-cyan)',
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Save Pipelines
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '6px' }}>System Security Control</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Ensure robust operation. Safe exits close web applications and return directly back to standard Android layouts.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Safety Fallback Keycode Trigger
              </label>
              <input
                type="text"
                value={settings.safetyExitCode}
                onChange={(e) => setSettings((prev) => ({ ...prev, safetyExitCode: e.target.value }))}
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div
              className="glass-panel-light"
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                <Shield size={16} />
                <strong>How to Emergency Exit Back to Android:</strong>
              </div>
              <div>
                Tritium OS functions inside a full-screen application. If you experience an issue or wish to exit back to Android instantly:
                <br />
                <span style={{ color: '#cbd5e1', fontWeight: 500 }}>
                  Rapidly tap the central Tritium logo at the top center of the status bar 5 times.
                </span>
                <br />
                This safety fallback instantly exits the full-screen container back to the host operating system launcher.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const activeTabStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'rgba(6, 182, 212, 0.12)',
  border: 'none',
  color: 'var(--color-accent-cyan)',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
  transition: 'var(--transition-fast)',
};

const inactiveTabStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'none',
  border: 'none',
  color: 'var(--color-text-secondary)',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 400,
  transition: 'var(--transition-fast)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(0, 0, 0, 0.35)',
  border: '1px solid var(--color-border-glass)',
  borderRadius: '10px',
  color: '#f8fafc',
  fontSize: '13px',
  outline: 'none',
  transition: 'var(--transition-fast)',
};
export default SettingsApp;
