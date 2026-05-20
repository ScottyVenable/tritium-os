import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Globe, FileText, FolderOpen, Settings, ShoppingBag, Bot, Battery, Wifi } from 'lucide-react';
import type { OSWindow, OSAppType, FileSystemNode, AIConfig, OSSettings, PeripheralStatus } from '../types/os';
import { TritiumLogo } from './TritiumLogo';
import { Window } from './Window';
import { TerminalApp } from './apps/TerminalApp';
import { BrowserApp } from './apps/BrowserApp';
import { NotepadApp } from './apps/NotepadApp';
import { DriveApp } from './apps/DriveApp';
import { SettingsApp } from './apps/SettingsApp';
import { AppStore } from './apps/AppStore';

interface DesktopModeProps {
  windows: OSWindow[];
  setWindows: React.Dispatch<React.SetStateAction<OSWindow[]>>;
  activeWindowId: string;
  setActiveWindowId: (id: string) => void;
  openApp: (appType: OSAppType) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  maximizeApp: (id: string) => void;
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
  peripheralStatus: PeripheralStatus;
  onExitSafety: () => void;
}

export const DesktopMode: React.FC<DesktopModeProps> = ({
  windows,
  setWindows,
  activeWindowId,
  setActiveWindowId,
  openApp,
  closeApp,
  minimizeApp,
  maximizeApp,
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
  peripheralStatus,
  onExitSafety,
}) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  
  // Virtual mouse pointer tracking coordinates
  const [pointerX, setPointerX] = useState(window.innerWidth / 2);
  const [pointerY, setPointerY] = useState(window.innerHeight / 2);
  const [isPointerVisible, setIsPointerVisible] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, pX: 0, pY: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: settings.clock12h !== false }));
      setDate(now.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [settings.clock12h]);

  // Trackpad simulation dragging on the screen
  const handleTouchStart = (e: React.TouchEvent) => {
    if (peripheralStatus.hasMouse || !settings.useVirtualCursor) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      pX: pointerX,
      pY: pointerY,
    };
    setIsPointerVisible(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (peripheralStatus.hasMouse || !settings.useVirtualCursor) return;
    const touch = e.touches[0];
    const deltaX = (touch.clientX - touchStartRef.current.x) * 1.5; // speed multiplier
    const deltaY = (touch.clientY - touchStartRef.current.y) * 1.5;

    let newX = touchStartRef.current.pX + deltaX;
    let newY = touchStartRef.current.pY + deltaY;

    // Boundary checks
    newX = Math.max(0, Math.min(window.innerWidth - 10, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 10, newY));

    setPointerX(newX);
    setPointerY(newY);
  };

  const handleTouchEnd = () => {
    // Virtual click click triggers at pointer coordinates
    if (peripheralStatus.hasMouse || !settings.useVirtualCursor) return;
    const el = document.elementFromPoint(pointerX, pointerY) as HTMLElement;
    if (el) {
      el.click();
      // Focus target if interactive
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.focus();
      }
    }
    // Fade cursor slowly
    setTimeout(() => {
      setIsPointerVisible(false);
    }, 1500);
  };

  const handleWindowMove = (id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const handleWindowResize = (id: string, w: number, h: number) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, width: w, height: h } : win))
    );
  };

  const handleFocusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const maxZ = prev.reduce((max, w) => Math.max(max, w.zIndex), 0);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
    });
  };

  const renderAppContent = (appType: OSAppType) => {
    switch (appType) {
      case 'terminal':
        return (
          <TerminalApp
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            fileSystem={fileSystem}
            setFileSystem={setFileSystem}
            aiConfig={aiConfig}
          />
        );
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
            onOpenFileInNotepad={() => openApp('notepad')}
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
            onUninstall={(id) => {
              const win = windows.find((w) => w.appType === id);
              if (win) closeApp(win.id);
            }}
          />
        );
      default:
        return <div style={{ padding: '20px' }}>Application Under Development</div>;
    }
  };

  // Safe logo click detector (fallback trigger check)
  const logoClicksRef = useRef(0);
  const handleLogoClick = () => {
    logoClicksRef.current += 1;
    if (logoClicksRef.current >= 5) {
      logoClicksRef.current = 0;
      onExitSafety();
    }
    setTimeout(() => {
      logoClicksRef.current = 0;
    }, 2000);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Desktop Main Workspace Panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Desktop Icons Grid */}
        <div
          className="desktop-grid-container"
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            zIndex: 1,
          }}
        >
          {/* Terminal Shortcut */}
          <div onClick={() => openApp('terminal')} className="desktop-shortcut">
            <div className="icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', boxShadow: 'var(--glow-cyan)' }}>
              <Terminal size={22} style={{ color: 'var(--color-accent-cyan)' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 500 }}>Terminal</span>
          </div>

          {/* Web Browser Shortcut */}
          <div onClick={() => openApp('browser')} className="desktop-shortcut">
            <div className="icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.25)', boxShadow: 'var(--glow-blue)' }}>
              <Globe size={22} style={{ color: 'var(--color-accent-blue-bright)' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 500 }}>Browser</span>
          </div>

          {/* Drive Explorer Shortcut */}
          <div onClick={() => openApp('drive')} className="desktop-shortcut">
            <div className="icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
              <FolderOpen size={22} style={{ color: 'var(--color-accent-purple)' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 500 }}>Files Drive</span>
          </div>

          {/* App Store Shortcut */}
          <div onClick={() => openApp('store')} className="desktop-shortcut">
            <div className="icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <ShoppingBag size={22} style={{ color: '#ec4899' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 500 }}>App Store</span>
          </div>
        </div>

        {/* Dynamic Desktop Widget - Clock/AI status */}
        <div
          className="desktop-clock-widget glass-panel-light"
          onClick={() => setSettings((prev) => ({ ...prev, clock12h: !prev.clock12h }))}
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '280px',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.04)',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          title="Click to toggle 12h/24h format"
        >
          <div>
            <h1 style={{ fontSize: '38px', fontWeight: 500, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0, fontFamily: 'var(--font-title)' }}>
              {time}
            </h1>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.05em' }}>
              {date.toUpperCase()}
            </span>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.08)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--color-accent-cyan)' }}>
              <Bot size={18} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
                {aiConfig.provider ? `${aiConfig.provider.toUpperCase()} ENGINE` : 'MOCK ENGINE'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                System AI coprocessor linking ok
              </div>
            </div>
          </div>
        </div>

        {/* Render Open Windows */}
        {windows
          .filter((w) => w.isOpen && !w.isMinimized)
          .map((w) => (
            <Window
              key={w.id}
              window={w}
              onClose={closeApp}
              onMinimize={minimizeApp}
              onMaximize={maximizeApp}
              onFocus={handleFocusWindow}
              onMove={handleWindowMove}
              onResize={handleWindowResize}
              activeWindowId={activeWindowId}
            >
              {renderAppContent(w.appType)}
            </Window>
          ))}
      </div>

      {/* Glassmorphic Taskbar / Bottom Dock panel */}
      <div
        style={{
          height: 'var(--dock-height)',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '16px',
          zIndex: 9999,
          position: 'relative',
        }}
      >
        <div
          className="glass-panel"
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 20px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-dock)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Launcher logo and escape fallback clicker */}
          <button onClick={handleLogoClick} className="dock-icon-btn glow-cyan-hover" style={{ width: '32px', height: '32px', padding: 0 }} title="Tritium Core Launcher (Tap 5 times to exit OS)">
            <TritiumLogo size={32} glow={true} animated={true} />
          </button>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />

          {/* Quick Shortcuts */}
          <button onClick={() => openApp('terminal')} className="dock-icon-btn glow-cyan-hover" title="Interactive Terminal">
            <Terminal size={20} style={{ color: 'var(--color-accent-cyan)' }} />
          </button>
          <button onClick={() => openApp('browser')} className="dock-icon-btn glow-blue-hover" title="Web Browser">
            <Globe size={20} style={{ color: 'var(--color-accent-blue-bright)' }} />
          </button>
          <button onClick={() => openApp('notepad')} className="dock-icon-btn" title="Notepad Writer">
            <FileText size={20} style={{ color: '#e2e8f0' }} />
          </button>
          <button onClick={() => openApp('drive')} className="dock-icon-btn" title="Virtual File Drive">
            <FolderOpen size={20} style={{ color: 'var(--color-accent-purple)' }} />
          </button>
          <button onClick={() => openApp('settings')} className="dock-icon-btn" title="System Settings">
            <Settings size={20} style={{ color: 'var(--color-text-secondary)' }} />
          </button>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />

          {/* Mode Switch and global AI Summon */}
          <button
            onClick={toggleAISidebar}
            className="dock-icon-btn"
            style={{ position: 'relative' }}
            title="Global AI Assistant"
          >
            <Bot size={20} style={{ color: 'var(--color-accent-cyan)', filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.3))' }} />
          </button>

          <button
            onClick={() => setSettings((prev) => ({ ...prev, useVirtualCursor: !prev.useVirtualCursor }))}
            className="dock-icon-btn"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: settings.useVirtualCursor ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.04)',
              border: settings.useVirtualCursor ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255,255,255,0.06)',
              boxShadow: settings.useVirtualCursor ? 'var(--glow-cyan)' : 'none',
              fontSize: '11px',
              color: settings.useVirtualCursor ? 'var(--color-accent-cyan)' : '#cbd5e1',
              fontWeight: 600,
              marginRight: '6px',
            }}
            title={settings.useVirtualCursor ? "Switch to Direct Touch Controls" : "Switch to Virtual Trackpad Mouse Mode"}
          >
            {settings.useVirtualCursor ? "TRACKPAD MODE" : "TOUCH MODE"}
          </button>

          <button
            onClick={onSwitchMode}
            className="dock-icon-btn"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '11px',
              color: '#cbd5e1',
              fontWeight: 600,
            }}
            title="Switch to Phone Mode"
          >
            PHONE MODE
          </button>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />

          {/* Quick System Indicators */}
          <div
            onClick={() => setShowQuickSettings(!showQuickSettings)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Wifi size={14} style={{ color: 'var(--color-text-secondary)' }} />
            <Battery size={14} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '11px', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
              {time}
            </span>
          </div>
        </div>

        {/* Quick Settings dropdown panel */}
        {showQuickSettings && (
          <div
            className="glass-panel-heavy"
            style={{
              position: 'absolute',
              bottom: '72px',
              right: '20px',
              width: '220px',
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.06)',
              zIndex: 99999,
              animation: 'slide-up 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
              <span style={{ fontWeight: 600 }}>Tritium Core State</span>
              <span style={{ color: '#10b981' }}>Secure</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>WIFI Network</span>
              <span style={{ color: 'var(--color-accent-cyan)' }}>AI_Server_5G</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pixel 10 Link</span>
              <span style={{ color: 'var(--color-accent-cyan)' }}>Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Touch Pointer</span>
              <span>
                <input
                  type="checkbox"
                  checked={settings.useVirtualCursor}
                  onChange={(e) => setSettings((prev) => ({ ...prev, useVirtualCursor: e.target.checked }))}
                  style={{ accentColor: 'var(--color-accent-cyan)' }}
                />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Virtual Cursor Tracking indicator overlay */}
      {isPointerVisible && !peripheralStatus.hasMouse && settings.useVirtualCursor && (
        <div
          style={{
            position: 'absolute',
            left: pointerX,
            top: pointerY,
            pointerEvents: 'none',
            zIndex: 999999,
            transform: 'translate(0px, 0px)',
            transition: 'opacity 0.2s ease',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 6px var(--color-accent-cyan))' }}>
            <path d="M4.5 3V19.5L9.75 14.25H18L4.5 3Z" fill="var(--color-accent-cyan)" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <style>{`
        .desktop-shortcut {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          width: 72px;
          text-align: center;
          transition: transform 0.2s ease;
        }
        .desktop-shortcut:hover {
          transform: scale(1.05);
        }
        .icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .dock-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: var(--transition-fast);
        }
        .dock-icon-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          transform: translateY(-2px);
        }
        @media (max-width: 820px) {
          .desktop-grid-container {
            top: auto !important;
            bottom: 120px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            flex-direction: row !important;
            justify-content: center !important;
            gap: 16px !important;
          }
          .desktop-clock-widget {
            top: 20px !important;
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            width: calc(100% - 40px) !important;
            max-width: 320px !important;
          }
        }
      `}</style>
    </div>
  );
};
