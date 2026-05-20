import React, { useState } from 'react';
import { Terminal, Globe, FolderOpen, Settings, Bot, Battery, Wifi, ChevronDown } from 'lucide-react';
import type { OSAppType, FileSystemNode, AIConfig, OSSettings, OSWindow } from '../types/os';
import { TerminalApp } from './apps/TerminalApp';
import { BrowserApp } from './apps/BrowserApp';
import { NotepadApp } from './apps/NotepadApp';
import { DriveApp } from './apps/DriveApp';
import { SettingsApp } from './apps/SettingsApp';
import { AppStore } from './apps/AppStore';

interface PhoneModeProps {
  username: string;
  setUsername: (name: string) => void;
  aiConfig: AIConfig;
  setAIConfig: (config: AIConfig) => void;
  settings: OSSettings;
  setSettings: React.Dispatch<React.SetStateAction<OSSettings>>;
  fileSystem: FileSystemNode;
  setFileSystem: React.Dispatch<React.SetStateAction<FileSystemNode>>;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  toggleAISidebar: () => void;
  onSwitchMode: () => void;
  onExitSafety: () => void;
  windows: OSWindow[];
  openApp: (appType: OSAppType) => void;
}

export const PhoneMode: React.FC<PhoneModeProps> = ({
  username,
  setUsername,
  aiConfig,
  setAIConfig,
  settings,
  setSettings,
  fileSystem,
  setFileSystem,
  currentPath,
  setCurrentPath,
  toggleAISidebar,
  onSwitchMode,
  onExitSafety,
  windows,
  openApp,
}) => {
  const [activeMobileApp, setActiveMobileApp] = useState<OSAppType | null>(null);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const clicks = logoClicks + 1;
    setLogoClicks(clicks);
    if (clicks >= 5) {
      setLogoClicks(0);
      onExitSafety();
    }
    setTimeout(() => {
      setLogoClicks(0);
    }, 2000);
  };

  const handleOpenMobileApp = (app: OSAppType) => {
    setActiveMobileApp(app);
  };

  const handleCloseMobileApp = () => {
    setActiveMobileApp(null);
  };

  const renderMobileAppContent = () => {
    if (!activeMobileApp) return null;

    switch (activeMobileApp) {
      case 'browser':
        return <BrowserApp />;
      case 'notepad':
        return (
          <NotepadApp
            fileSystem={fileSystem}
            setFileSystem={setFileSystem}
            currentPath={currentPath}
            aiConfig={aiConfig}
          />
        );
      case 'drive':
        return (
          <DriveApp
            fileSystem={fileSystem}
            setFileSystem={setFileSystem}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            onOpenFileInNotepad={() => handleOpenMobileApp('notepad')}
          />
        );
      case 'settings':
        return (
          <SettingsApp
            settings={settings}
            setSettings={setSettings}
            aiConfig={aiConfig}
            setAIConfig={setAIConfig}
            username={username}
            setUsername={setUsername}
          />
        );
      case 'store':
        return (
          <AppStore
            installedApps={windows.map((w) => w.appType)}
            onInstall={(id) => openApp(id as OSAppType)}
            onUninstall={() => {}}
          />
        );
      default:
        return <div style={{ padding: '20px' }}>App simulation active.</div>;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: '#02050c',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Custom Header (Overlaps/bypasses Android system bar) */}
      <div
        style={{
          height: 'calc(64px + env(safe-area-inset-top, 0px))',
          paddingTop: 'calc(26px + env(safe-area-inset-top, 0px))',
          paddingBottom: '8px',
          background: 'rgba(5, 9, 20, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 'calc(24px + env(safe-area-inset-left, 0px))',
          paddingRight: 'calc(24px + env(safe-area-inset-right, 0px))',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-muted)',
          zIndex: 100,
        }}
      >
        <div onClick={handleLogoClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} title="Tap 5 times to exit back to Android">
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-cyan)', boxShadow: 'var(--glow-cyan)' }} />
          <span style={{ fontWeight: 600, color: '#f8fafc', letterSpacing: '0.05em' }}>TRITIUM MOBILE SHELL</span>
        </div>

        <div 
          onClick={() => setSettings((prev) => ({ ...prev, clock12h: !prev.clock12h }))}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
          title="Click to toggle 12h/24h format"
        >
          <Wifi size={13} />
          <Battery size={13} style={{ color: '#10b981' }} />
          <span style={{ color: '#f8fafc', fontWeight: 500 }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: settings.clock12h !== false })}
          </span>
        </div>
      </div>

      {/* Main portrait content: A full-screen backend Linux terminal */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <TerminalApp
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
          fileSystem={fileSystem}
          setFileSystem={setFileSystem}
          aiConfig={aiConfig}
        />

        {/* Sliding Card Overlays for other Apps */}
        {activeMobileApp && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#040814',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 50,
              animation: 'mobile-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Card Header Drag-bar */}
            <div
              style={{
                height: '44px',
                background: 'rgba(10, 18, 36, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent-cyan)' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {activeMobileApp}
                </span>
              </div>
              <button
                onClick={handleCloseMobileApp}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ChevronDown size={18} />
                <span style={{ fontSize: '11px' }}>Dismiss</span>
              </button>
            </div>

            {/* Mobile App Screen Frame */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {renderMobileAppContent()}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Dock Navigation panel */}
      <div
        className="glass-panel"
        style={{
          height: '64px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-dock)',
          zIndex: 90,
          background: 'rgba(5, 9, 20, 0.92)',
        }}
      >
        <button
          onClick={onSwitchMode}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '10px',
            color: '#f8fafc',
            fontWeight: 600,
          }}
          title="Switch to Desktop Mode"
        >
          DESKTOP
        </button>

        {/* Shortcuts */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <button onClick={() => setActiveMobileApp(null)} className="mobile-dock-btn" style={{ background: activeMobileApp === null ? 'rgba(6, 182, 212, 0.08)' : 'none' }}>
            <Terminal size={18} style={{ color: activeMobileApp === null ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)' }} />
          </button>
          <button onClick={() => handleOpenMobileApp('browser')} className="mobile-dock-btn" style={{ background: activeMobileApp === 'browser' ? 'rgba(37, 99, 235, 0.08)' : 'none' }}>
            <Globe size={18} style={{ color: activeMobileApp === 'browser' ? 'var(--color-accent-blue-bright)' : 'var(--color-text-secondary)' }} />
          </button>
          <button onClick={() => handleOpenMobileApp('drive')} className="mobile-dock-btn" style={{ background: activeMobileApp === 'drive' ? 'rgba(139, 92, 246, 0.08)' : 'none' }}>
            <FolderOpen size={18} style={{ color: activeMobileApp === 'drive' ? 'var(--color-accent-purple)' : 'var(--color-text-secondary)' }} />
          </button>
          <button onClick={() => handleOpenMobileApp('settings')} className="mobile-dock-btn" style={{ background: activeMobileApp === 'settings' ? 'rgba(255, 255, 255, 0.04)' : 'none' }}>
            <Settings size={18} style={{ color: activeMobileApp === 'settings' ? '#cbd5e1' : 'var(--color-text-secondary)' }} />
          </button>
        </div>

        {/* Global AI summon */}
        <button onClick={toggleAISidebar} className="mobile-dock-btn">
          <Bot size={18} style={{ color: 'var(--color-accent-cyan)' }} />
        </button>
      </div>

      <style>{`
        @keyframes mobile-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .mobile-dock-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
export default PhoneMode;
