import { useState, useEffect } from 'react';
import { LockScreen } from './components/LockScreen';
import { Walkthrough } from './components/Walkthrough';
import { PeripheralsPopup } from './components/PeripheralsPopup';
import { DesktopMode } from './components/DesktopMode';
import { PhoneMode } from './components/PhoneMode';
import { AISidebar } from './components/apps/AISidebar';
import type { OSWindow, OSAppType, AIConfig, OSSettings, PeripheralStatus, FileSystemNode } from './types/os';

// Setup default virtual file system structure
const defaultFileSystem: FileSystemNode = {
  name: 'root',
  path: '/',
  isFolder: true,
  children: [
    {
      name: 'home',
      path: '/home',
      isFolder: true,
      children: [
        {
          name: 'operator',
          path: '/home/operator',
          isFolder: true,
          children: [
            {
              name: 'readme.txt',
              path: '/home/operator/readme.txt',
              isFolder: false,
              content: `WELCOME TO TRITIUM OS v2.0
==========================
Tritium OS is a highly advanced operating system shell running client-side on Android and desktop environments.

Quick Terminal Commands:
- Type 'neofetch' to view Pixel 10 Pro hardware parameters.
- Type 'help' to review directory controls (cd, ls, mkdir, pwd).
- Type 'ai [your prompt]' to trigger the system LLM.

Emergency Safety Fallback:
- In case of issues, rapidly tap the top-left status indicators 5 times to immediately trigger a clean exit back to native Android.

Thank you for operating Tritium!
`
            },
            {
              name: 'notes',
              path: '/home/operator/notes',
              isFolder: true,
              children: []
            }
          ]
        }
      ]
    },
    {
      name: 'bin',
      path: '/bin',
      isFolder: true,
      children: []
    }
  ]
};

function App() {
  // Authentication & Onboarding Lock States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [username, setUsername] = useState('Tritium Operator');

  // Multi-Mode Layout States ('desktop' or 'phone')
  const [mode, setMode] = useState<'desktop' | 'phone'>('phone');

  // AI & Appearance Customizer States
  const [aiConfig, setAIConfig] = useState<AIConfig>({
    provider: 'google',
    apiKey: '',
    model: 'gemini-1.5-flash',
  });

  const [settings, setSettings] = useState<OSSettings>({
    wallpaper: 'neon-waves',
    theme: 'crystal',
    blurAmount: 20,
    glowColor: '#06b6d4',
    fontSize: 14,
    safetyExitCode: 'TRITIUM-EXIT',
    useVirtualCursor: true,
    clock12h: true,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Peripheral Connection Monitor States
  const [peripheralStatus, setPeripheralStatus] = useState<PeripheralStatus>({
    hasKeyboard: false,
    hasMouse: false,
    popupDismissed: false,
  });

  // Virtual File System State
  const [fileSystem, setFileSystem] = useState<FileSystemNode>(defaultFileSystem);
  const [currentPath, setCurrentPath] = useState('/home/operator');

  // Floating Windows Manager States
  const [windows, setWindows] = useState<OSWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string>('');

  // Global AI Side panel summoner
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

  // Load local configurations on mount
  useEffect(() => {
    const savedName = localStorage.getItem('tritium_username');
    const savedAI = localStorage.getItem('tritium_ai_config');
    const savedSettings = localStorage.getItem('tritium_settings');
    const savedOnboarding = localStorage.getItem('tritium_onboarded');

    if (savedName) setUsername(savedName);
    if (savedAI) {
      try {
        setAIConfig(JSON.parse(savedAI));
      } catch (e) {}
    }
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {}
    }
    if (savedOnboarding === 'true') {
      setShowWalkthrough(false);
    }
    setIsLoaded(true);
  }, []);

  // Persist settings whenever they change (after load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tritium_settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Persist AI configurations whenever they change (after load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tritium_ai_config', JSON.stringify(aiConfig));
    }
  }, [aiConfig, isLoaded]);

  // Update modes based on peripheral links dynamically
  useEffect(() => {
    if (peripheralStatus.hasKeyboard || peripheralStatus.hasMouse) {
      setMode('desktop');
    }
  }, [peripheralStatus.hasKeyboard, peripheralStatus.hasMouse]);

  const handleOnboardingComplete = (name: string, ai: AIConfig, setts: OSSettings) => {
    setUsername(name);
    setAIConfig(ai);
    setSettings(setts);
    setShowWalkthrough(false);

    localStorage.setItem('tritium_username', name);
    localStorage.setItem('tritium_ai_config', JSON.stringify(ai));
    localStorage.setItem('tritium_settings', JSON.stringify(setts));
    localStorage.setItem('tritium_onboarded', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowWalkthrough(false);
    localStorage.setItem('tritium_onboarded', 'true');
  };

  // Drag and Focus window helper triggers
  const handleOpenApp = (appType: OSAppType) => {
    // If window already open, focus it
    const existing = windows.find((w) => w.appType === appType);
    if (existing) {
      handleFocusWindow(existing.id);
      return;
    }

    const newId = `${appType}_${Date.now()}`;
    const newWindow: OSWindow = {
      id: newId,
      title: `${appType.toUpperCase()} - Core Client`,
      appType: appType,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 100 + windows.length * 30,
      y: 80 + windows.length * 30,
      width: 680,
      height: 480,
      zIndex: windows.length + 1,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newId);
  };

  const handleCloseWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const handleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const handleFocusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const maxZ = prev.reduce((max, w) => Math.max(max, w.zIndex), 0);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
    });
  };

  // Bypasses the app completely to go back to standard Android (emergency shutdown)
  const handleExitSafety = () => {
    const confirmClose = window.confirm('WARNING: Emergency Safety Fallback activated. Do you want to force shutdown Tritium OS and return to Android launcher?');
    if (confirmClose) {
      setIsUnlocked(false);
      // Close actual window frames if using web containers
      window.close();
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontSize: `${settings.fontSize}px`,
        '--color-accent-cyan': settings.glowColor,
        '--glow-cyan': `0 0 12px ${settings.glowColor}40, 0 0 24px ${settings.glowColor}15`,
      } as React.CSSProperties}
      className="tritium-background"
    >
      {/* Background aesthetic orbs */}
      <div className="ambient-orb orb-cyan" />
      <div className="ambient-orb orb-blue" />
      <div className="ambient-orb orb-purple" />

      {/* Screen sleep protector */}
      {!isUnlocked && (
        <LockScreen
          onUnlock={() => setIsUnlocked(true)}
          isUnlocked={isUnlocked}
          settings={settings}
          setSettings={setSettings}
        />
      )}

      {/* Onboarding walkthrough setup wizard */}
      {isUnlocked && showWalkthrough && (
        <Walkthrough onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
      )}

      {/* Main Core Interfaces */}
      {isUnlocked && !showWalkthrough && (
        <>
          {mode === 'desktop' ? (
            <DesktopMode
              windows={windows}
              setWindows={setWindows}
              activeWindowId={activeWindowId}
              setActiveWindowId={setActiveWindowId}
              openApp={handleOpenApp}
              closeApp={handleCloseWindow}
              minimizeApp={handleMinimizeWindow}
              maximizeApp={handleMaximizeWindow}
              username={username}
              setUsername={setUsername}
              aiConfig={aiConfig}
              setAIConfig={setAIConfig}
              settings={settings}
              setSettings={setSettings}
              fileSystem={fileSystem}
              setFileSystem={setFileSystem}
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              toggleAISidebar={() => setIsAISidebarOpen(!isAISidebarOpen)}
              onSwitchMode={() => setMode('phone')}
              peripheralStatus={peripheralStatus}
              onExitSafety={handleExitSafety}
            />
          ) : (
            <PhoneMode
              username={username}
              setUsername={setUsername}
              aiConfig={aiConfig}
              setAIConfig={setAIConfig}
              settings={settings}
              setSettings={setSettings}
              fileSystem={fileSystem}
              setFileSystem={setFileSystem}
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              toggleAISidebar={() => setIsAISidebarOpen(!isAISidebarOpen)}
              onSwitchMode={() => setMode('desktop')}
              onExitSafety={handleExitSafety}
              windows={windows}
              openApp={handleOpenApp}
            />
          )}

          {/* Connected Peripherals HUD popup alerts */}
          <PeripheralsPopup status={peripheralStatus} setStatus={setPeripheralStatus} />

          {/* Global Assistant side panel sheets */}
          <AISidebar
            isOpen={isAISidebarOpen}
            onClose={() => setIsAISidebarOpen(false)}
            aiConfig={aiConfig}
          />
        </>
      )}
    </div>
  );
}

export default App;
