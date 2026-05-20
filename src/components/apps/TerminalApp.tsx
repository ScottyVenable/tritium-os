import React, { useState, useRef, useEffect } from 'react';
import { CornerDownLeft } from 'lucide-react';
import type { FileSystemNode, AIConfig } from '../../types/os';

interface TerminalAppProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  fileSystem: FileSystemNode;
  setFileSystem: React.Dispatch<React.SetStateAction<FileSystemNode>>;
  aiConfig: AIConfig;
}

interface CommandLog {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

export const TerminalApp: React.FC<TerminalAppProps> = ({
  currentPath,
  setCurrentPath,
  fileSystem,
  setFileSystem,
  aiConfig,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    { text: 'TRITIUM CORE SHELL v2.0 - INITIALIZED', type: 'system' },
    { text: 'Type "help" to list available commands. Type "neofetch" for system spec metrics.', type: 'output' },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  // Helper to find a node by path
  const findNodeByPath = (root: FileSystemNode, pathStr: string): FileSystemNode | null => {
    if (pathStr === '/' || pathStr === '') return root;
    const parts = pathStr.split('/').filter(Boolean);
    let current: FileSystemNode = root;

    for (const part of parts) {
      if (!current.children) return null;
      const found = current.children.find((child) => child.name === part);
      if (!found) return null;
      current = found;
    }
    return current;
  };

  const getSystemInfoASCII = () => {
    return `
   /\\_/\\
  / o o \\       Tritium OS 2.0 (Model: AI-Server HUD)
 (   "   )      Kernel: Linux 6.12.0-tritium-core-arm64
  \\_____/       OS Architecture: Hybrid Android 15/16 + Web-Shell
  /     \\       Hardware Target: Google Pixel 10 Pro
 (  | |  )      Cores: Tensor G5 Deca-Core
  \\_|_|_/       Connected Peripherals: Mouse/Keyboard Link
                AI Core Integration: ${aiConfig.provider ? aiConfig.provider.toUpperCase() : 'None (Mock Active)'}
                Memory Usage: 4.82 GB / 16.00 GB (30%)
                System Status: SECURE OPERATIONAL STATE
`;
  };

  const handleCommand = async (fullCmd: string) => {
    const trimmed = fullCmd.trim();
    if (!trimmed) return;

    setCmdHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);

    const newLogs: CommandLog[] = [...history, { text: `operator@tritium:${currentPath}$ ${trimmed}`, type: 'input' }];

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const currentNode = findNodeByPath(fileSystem, currentPath);

    if (!currentNode) {
      newLogs.push({ text: 'Error: Broken directory reference.', type: 'error' });
      setHistory(newLogs);
      return;
    }

    switch (cmd) {
      case 'help':
        newLogs.push({
          text: `Available Commands:
  help           - Display list of terminal actions
  clear          - Flush console screens
  ls             - List directory folders and entities
  cd [path]      - Change active navigation folder
  mkdir [name]   - Create virtual folder structure
  cat [file]     - Write contents of a specific file to console
  rm [target]    - Delete virtual file or folder
  pwd            - Output full path to current workspace
  neofetch       - Display system specifications and Tritium ASCII art
  ai [prompt]    - Engage the Tritium Assistant directly`,
          type: 'output',
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'pwd':
        newLogs.push({ text: currentPath || '/', type: 'output' });
        break;

      case 'neofetch':
        newLogs.push({ text: getSystemInfoASCII(), type: 'success' });
        break;

      case 'ls':
        if (currentNode.children && currentNode.children.length > 0) {
          const fileList = currentNode.children
            .map((c) => `${c.isFolder ? 'DIR  ' : 'FILE '} ${c.name}`)
            .join('\n');
          newLogs.push({ text: fileList, type: 'output' });
        } else {
          newLogs.push({ text: '(empty directory)', type: 'output' });
        }
        break;

      case 'cd':
        const targetDir = args[0];
        if (!targetDir) {
          setCurrentPath('/');
          newLogs.push({ text: 'Moved to system root directory.', type: 'output' });
        } else if (targetDir === '..') {
          if (currentPath === '/' || currentPath === '') {
            newLogs.push({ text: 'Already in root folder.', type: 'output' });
          } else {
            const index = currentPath.lastIndexOf('/');
            const parent = currentPath.substring(0, index);
            setCurrentPath(parent || '/');
          }
        } else {
          const cleanTarget = targetDir.startsWith('/') ? targetDir : `${currentPath}/${targetDir}`.replace(/\/+/g, '/');
          const found = findNodeByPath(fileSystem, cleanTarget);
          if (found && found.isFolder) {
            setCurrentPath(cleanTarget);
          } else {
            newLogs.push({ text: `cd: directory not found: ${targetDir}`, type: 'error' });
          }
        }
        break;

      case 'mkdir':
        const newDirName = args[0];
        if (!newDirName) {
          newLogs.push({ text: 'usage: mkdir [directory_name]', type: 'error' });
        } else {
          // Mutation helper
          const addFolder = (node: FileSystemNode): FileSystemNode => {
            if (node.path === currentPath) {
              const children = node.children || [];
              if (children.some((c) => c.name === newDirName)) {
                throw new Error(`Folder already exists: ${newDirName}`);
              }
              return {
                ...node,
                children: [...children, { name: newDirName, path: `${currentPath}/${newDirName}`.replace(/\/+/g, '/'), isFolder: true, children: [] }],
              };
            }
            if (node.children) {
              return { ...node, children: node.children.map(addFolder) };
            }
            return node;
          };

          try {
            setFileSystem((prev) => addFolder(prev));
            newLogs.push({ text: `Created directory: ${newDirName}`, type: 'success' });
          } catch (e: any) {
            newLogs.push({ text: e.message, type: 'error' });
          }
        }
        break;

      case 'cat':
        const fileName = args[0];
        if (!fileName) {
          newLogs.push({ text: 'usage: cat [file_name]', type: 'error' });
        } else {
          const fileNode = currentNode.children?.find((c) => c.name === fileName && !c.isFolder);
          if (fileNode) {
            newLogs.push({ text: fileNode.content || '(empty file)', type: 'output' });
          } else {
            newLogs.push({ text: `cat: file not found: ${fileName}`, type: 'error' });
          }
        }
        break;

      case 'rm':
        const removeTarget = args[0];
        if (!removeTarget) {
          newLogs.push({ text: 'usage: rm [filename_or_folder]', type: 'error' });
        } else {
          const rmNode = (node: FileSystemNode): FileSystemNode => {
            if (node.path === currentPath) {
              const children = node.children || [];
              if (!children.some((c) => c.name === removeTarget)) {
                throw new Error(`Target not found: ${removeTarget}`);
              }
              return {
                ...node,
                children: children.filter((c) => c.name !== removeTarget),
              };
            }
            if (node.children) {
              return { ...node, children: node.children.map(rmNode) };
            }
            return node;
          };

          try {
            setFileSystem((prev) => rmNode(prev));
            newLogs.push({ text: `Removed target: ${removeTarget}`, type: 'success' });
          } catch (e: any) {
            newLogs.push({ text: e.message, type: 'error' });
          }
        }
        break;

      case 'ai':
        const query = args.join(' ');
        if (!query) {
          newLogs.push({ text: 'usage: ai [your_prompt_question_here]', type: 'error' });
        } else {
          newLogs.push({ text: 'Engaging Tritium AI Coprocessor Pipeline...', type: 'system' });
          setHistory(newLogs); // Render loading line immediately
          
          const aiResponse = await fetchAIResponse(query);
          setHistory((prev) => [...prev, { text: `[TRITIUM AI]: ${aiResponse}`, type: 'success' }]);
          setInput('');
          return;
        }
        break;

      default:
        newLogs.push({ text: `bash: command not recognized: ${cmd}. Type "help" for support.`, type: 'error' });
    }

    setHistory(newLogs);
    setInput('');
  };

  const fetchAIResponse = async (prompt: string): Promise<string> => {
    if (!aiConfig.provider) {
      // Mocked Smart System Coprocessor when no key is registered
      return `SYSTEM COMPILATION: Performed diagnosis on shell pipeline. No live LLM keys are connected in settings, but Tritium Local Core simulation reports:
"Your prompt requested assistance with: '${prompt}'. In standard operation, I will process this prompt using ${aiConfig.provider || 'Local LLM core'} to generate code, system scripts, or answers. Configure a live key in Settings to unleash full capability!"`;
    }

    try {
      if (aiConfig.provider === 'google') {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiConfig.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `You are Tritium OS system AI, integrated into the user's customized shell environment on Pixel 10 Pro. Answer this request succinctly: ${prompt}` }] }],
            }),
          }
        );
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      }

      if (aiConfig.provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${aiConfig.apiKey}`,
          },
          body: JSON.stringify({
            model: aiConfig.model,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
      }

      if (aiConfig.provider === 'anthropic') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': aiConfig.apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: aiConfig.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
          }),
        });
        const data = await response.json();
        return data.content[0].text;
      }

      if (aiConfig.provider === 'lmstudio' || aiConfig.provider === 'ollama') {
        const url = aiConfig.provider === 'lmstudio' ? 'http://localhost:1234/v1/chat/completions' : 'http://localhost:11434/api/chat';
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: aiConfig.model,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await response.json();
        return aiConfig.provider === 'lmstudio' ? data.choices[0].message.content : data.message.content;
      }

      return 'Error: Unsupported AI provider configuration.';
    } catch (e: any) {
      return `AI Coprocessor link encountered an error: ${e.message || 'Check your internet connection and API key parameters in Settings.'}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIdx(nextIdx);
          setInput(cmdHistory[nextIdx]);
        }
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      const nextIdx = historyIdx - 1;
      if (nextIdx >= 0) {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
      e.preventDefault();
    }
  };

  return (
    <div
      onClick={focusInput}
      style={{
        width: '100%',
        height: '100%',
        background: '#02050c',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: '#34d399',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        overflow: 'hidden',
        cursor: 'text',
      }}
    >
      {/* Shell Log Display */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {history.map((log, idx) => {
          let logColor = '#cbd5e1';
          if (log.type === 'input') logColor = '#3b82f6';
          else if (log.type === 'error') logColor = '#f87171';
          else if (log.type === 'success') logColor = '#34d399';
          else if (log.type === 'system') logColor = '#a855f7';

          return (
            <div key={idx} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: logColor, wordBreak: 'break-word' }}>
              {log.text}
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>

      {/* Input Prompt Panel */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '12px',
        }}
      >
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>operator@tritium:{currentPath}$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#f8fafc',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
          }}
          placeholder="Enter command..."
        />
        <CornerDownLeft size={14} style={{ color: 'var(--color-text-muted)' }} />
      </div>
    </div>
  );
};
