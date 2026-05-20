import React, { useState, useEffect } from 'react';
import { Save, FileText, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import type { FileSystemNode, AIConfig } from '../../types/os';

interface NotepadAppProps {
  fileSystem: FileSystemNode;
  setFileSystem: React.Dispatch<React.SetStateAction<FileSystemNode>>;
  currentPath: string;
  aiConfig: AIConfig;
}

export const NotepadApp: React.FC<NotepadAppProps> = ({
  fileSystem,
  setFileSystem,
  currentPath,
  aiConfig,
}) => {
  const [noteTitle, setNoteTitle] = useState('untitled.txt');
  const [content, setContent] = useState('');
  const [aiAssistantActive, setAiAssistantActive] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('Summarize the text above');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);

  // Find files in current directory to load
  useEffect(() => {
    const parts = currentPath.split('/').filter(Boolean);
    let curr = fileSystem;
    for (const part of parts) {
      if (curr.children) {
        const found = curr.children.find((c) => c.name === part);
        if (found) curr = found;
      }
    }
    if (curr.children) {
      const textFiles = curr.children.filter((c) => !c.isFolder).map((c) => c.name);
      setAvailableFiles(textFiles);
    }
  }, [fileSystem, currentPath]);

  const handleSave = () => {
    if (!noteTitle.endsWith('.txt')) {
      alert('Error: Document title must end with .txt');
      return;
    }

    const saveFile = (node: FileSystemNode): FileSystemNode => {
      if (node.path === currentPath) {
        const children = node.children || [];
        const existingIdx = children.findIndex((c) => c.name === noteTitle);

        if (existingIdx !== -1) {
          // Overwrite existing
          const updatedChildren = [...children];
          updatedChildren[existingIdx] = {
            ...updatedChildren[existingIdx],
            content: content,
          };
          return { ...node, children: updatedChildren };
        } else {
          // Create new
          return {
            ...node,
            children: [
              ...children,
              {
                name: noteTitle,
                path: `${currentPath}/${noteTitle}`.replace(/\/+/g, '/'),
                isFolder: false,
                content: content,
              },
            ],
          };
        }
      }

      if (node.children) {
        return { ...node, children: node.children.map(saveFile) };
      }
      return node;
    };

    setFileSystem((prev) => saveFile(prev));
    alert(`File "${noteTitle}" saved successfully in ${currentPath || '/'}`);
  };

  const handleLoadFile = (name: string) => {
    const parts = currentPath.split('/').filter(Boolean);
    let curr = fileSystem;
    for (const part of parts) {
      if (curr.children) {
        const found = curr.children.find((c) => c.name === part);
        if (found) curr = found;
      }
    }
    const file = curr.children?.find((c) => c.name === name);
    if (file) {
      setNoteTitle(file.name);
      setContent(file.content || '');
    }
  };

  const handleAIAction = async (actionType: 'summarize' | 'polish' | 'expand') => {
    if (!content.trim()) {
      alert('Please write some content first.');
      return;
    }

    setIsAiLoading(true);
    setAiAssistantActive(true);

    let prompt = '';
    if (actionType === 'summarize') {
      prompt = `Provide a concise, high-level summary of the following document:\n\n${content}`;
      setAiInstruction('Summarizing document...');
    } else if (actionType === 'polish') {
      prompt = `Polish and improve the writing, grammar, and tone of the following document to sound professional, modern, and corporate-sleek:\n\n${content}`;
      setAiInstruction('Polishing style tone...');
    } else if (actionType === 'expand') {
      prompt = `Expand on the topics presented in this text to add depth and comprehensive details:\n\n${content}`;
      setAiInstruction('Expanding arguments...');
    }

    try {
      let resultText = '';
      if (!aiConfig.provider) {
        // Mock Pipeline fallback
        resultText = `[Mock AI System Onboarding Fallback]: Registered active mock analyzer feedback for prompt command.
"Your document is centered around notes of title '${noteTitle}' containing ${content.length} characters. Connect a live provider API key inside Settings to run real-time generative summaries!"`;
      } else {
        if (aiConfig.provider === 'google') {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiConfig.apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
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
              messages: [{ role: 'user', content: prompt }],
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
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 600,
            }),
          });
          const data = await response.json();
          resultText = data.content[0].text;
        }
      }

      setAiResult(resultText);
    } catch (e: any) {
      setAiResult(`AI operation failed: ${e.message || 'Check network connection or credentials.'}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiResultToEditor = () => {
    setContent(aiResult);
    setAiAssistantActive(false);
    setAiResult('');
  };

  return (
    <div
      className="notepad-container"
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#040916',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar - Local Note Loading */}
      <div
        className="notepad-sidebar"
        style={{
          width: '160px',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'rgba(0,0,0,0.15)',
        }}
      >
        <div className="notepad-sidebar-label" style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, paddingLeft: '8px', textTransform: 'uppercase' }}>
          LOCAL DIRECTORY
        </div>
        <div className="notepad-files-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
          {availableFiles.map((f) => (
            <button
              key={f}
              onClick={() => handleLoadFile(f)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: 'none',
                background: noteTitle === f ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                color: noteTitle === f ? 'var(--color-accent-cyan)' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <FileText size={14} />
              <span>{f}</span>
            </button>
          ))}
          {availableFiles.length === 0 && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', paddingLeft: '8px', fontStyle: 'italic' }}>
              No .txt files
            </span>
          )}
        </div>
      </div>

      {/* Main Workspace Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Editor Title Bar */}
        <div
          className="notepad-header"
          style={{
            height: '48px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            background: 'rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={16} style={{ color: 'var(--color-accent-cyan)' }} />
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#f8fafc',
                fontSize: '13px',
                fontWeight: 500,
                width: '180px',
              }}
              placeholder="filename.txt"
            />
          </div>

          <div className="notepad-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* AI Action helpers */}
            <button
              onClick={() => handleAIAction('summarize')}
              style={actionButtonStyle}
              title="Summarize content with AI"
            >
              <Sparkles size={14} />
              <span>AI Summarize</span>
            </button>
            <button
              onClick={() => handleAIAction('polish')}
              style={actionButtonStyle}
              title="Polish grammar with AI"
            >
              <Wand2 size={14} />
              <span>AI Polish</span>
            </button>

            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', height: '20px', margin: '0 4px' }} />

            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: 'var(--color-accent-cyan)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(6, 182, 212, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)')}
            >
              <Save size={14} />
              <span>Save File</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your system draft here..."
          style={{
            flex: 1,
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '20px',
            color: '#f1f5f9',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            lineHeight: '1.6',
            resize: 'none',
          }}
        />
      </div>

      {/* Slide-out AI Side Panel */}
      {aiAssistantActive && (
        <div
          style={{
            width: '280px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(5, 9, 20, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-cyan)', fontWeight: 500, fontSize: '13px' }}>
              <Sparkles size={16} />
              <span>AI Writing Assistant</span>
            </div>
            <button
              onClick={() => setAiAssistantActive(false)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '11px' }}
            >
              Close
            </button>
          </div>

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>
              PROMPT ACTION
            </span>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
              {aiInstruction}
            </div>

            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginTop: '12px' }}>
              GENERATIVE RESULT
            </span>

            {isAiLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                <RefreshCw size={14} className="spinning-icon" />
                <span>Running analysis...</span>
              </div>
            ) : (
              <div
                style={{
                  fontSize: '13px',
                  color: '#cbd5e1',
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  padding: '12px',
                  borderRadius: '10px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '320px',
                  overflowY: 'auto',
                }}
              >
                {aiResult}
              </div>
            )}
          </div>

          {!isAiLoading && aiResult && (
            <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '8px' }}>
              <button
                onClick={applyAiResultToEditor}
                style={{
                  flex: 1,
                  background: 'var(--color-accent-cyan)',
                  border: 'none',
                  color: '#020617',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Replace Content
              </button>
              <button
                onClick={() => setAiResult('')}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border-glass)',
                  color: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Discard
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slide-left {
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
        @media (max-width: 600px) {
          .notepad-container {
            flex-direction: column !important;
          }
          .notepad-sidebar {
            width: 100% !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
            flex-direction: row !important;
            align-items: center !important;
            padding: 8px 12px !important;
            gap: 16px !important;
          }
          .notepad-sidebar-label {
            display: none !important;
          }
          .notepad-files-list {
            flex-direction: row !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            flex: 1 !important;
            gap: 8px !important;
          }
          .notepad-files-list button {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            width: auto !important;
          }
          .notepad-header {
            height: auto !important;
            padding: 8px 12px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .notepad-actions {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
};

const actionButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--color-border-glass)',
  color: '#cbd5e1',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'var(--transition-fast)',
};
export default NotepadApp;
