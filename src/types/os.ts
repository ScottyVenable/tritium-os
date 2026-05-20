export interface OSWindow {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  appType: OSAppType;
}

export type OSAppType = 
  | 'terminal' 
  | 'browser' 
  | 'notepad' 
  | 'drive' 
  | 'settings' 
  | 'store' 
  | 'ai';

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'lmstudio' | 'ollama' | '';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface FileSystemNode {
  name: string;
  path: string;
  isFolder: boolean;
  content?: string;
  children?: FileSystemNode[];
}

export interface PeripheralStatus {
  hasKeyboard: boolean;
  hasMouse: boolean;
  popupDismissed: boolean;
}

export interface OSSettings {
  wallpaper: string;
  theme: 'dark' | 'light' | 'crystal';
  blurAmount: number;
  glowColor: string;
  fontSize: number;
  safetyExitCode: string;
  useVirtualCursor: boolean;
  clock12h?: boolean;
}
