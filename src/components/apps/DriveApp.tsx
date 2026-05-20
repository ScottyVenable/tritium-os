import React, { useState } from 'react';
import { Folder, FileText, ArrowLeft, Plus, Trash2, ArrowUp, Edit3 } from 'lucide-react';
import type { FileSystemNode } from '../../types/os';

interface DriveAppProps {
  fileSystem: FileSystemNode;
  setFileSystem: React.Dispatch<React.SetStateAction<FileSystemNode>>;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  onOpenFileInNotepad: () => void;
}

export const DriveApp: React.FC<DriveAppProps> = ({
  fileSystem,
  setFileSystem,
  currentPath,
  setCurrentPath,
  onOpenFileInNotepad,
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  // Helper to find node by path
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

  const currentNode = findNodeByPath(fileSystem, currentPath) || fileSystem;
  const items = currentNode.children || [];

  const handleNavigate = (node: FileSystemNode) => {
    if (node.isFolder) {
      setCurrentPath(node.path);
    }
  };

  const handleGoBack = () => {
    if (currentPath === '/' || currentPath === '') return;
    const lastSlash = currentPath.lastIndexOf('/');
    const parentPath = currentPath.substring(0, lastSlash) || '/';
    setCurrentPath(parentPath);
  };

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    const addFolder = (node: FileSystemNode): FileSystemNode => {
      if (node.path === currentPath) {
        const children = node.children || [];
        if (children.some((c) => c.name === trimmed)) {
          alert('Folder already exists.');
          return node;
        }
        return {
          ...node,
          children: [
            ...children,
            {
              name: trimmed,
              path: `${currentPath}/${trimmed}`.replace(/\/+/g, '/'),
              isFolder: true,
              children: [],
            },
          ],
        };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addFolder) };
      }
      return node;
    };

    setFileSystem((prev) => addFolder(prev));
    setNewFolderName('');
    setShowCreateFolder(false);
  };

  const handleDeleteItem = (name: string) => {
    const rmItem = (node: FileSystemNode): FileSystemNode => {
      if (node.path === currentPath) {
        const children = node.children || [];
        return {
          ...node,
          children: children.filter((c) => c.name !== name),
        };
      }
      if (node.children) {
        return { ...node, children: node.children.map(rmItem) };
      }
      return node;
    };

    setFileSystem((prev) => rmItem(prev));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: '#040714',
        color: '#f8fafc',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* File Explorer Controls */}
      <div
        style={{
          height: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: 'rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleGoBack}
            disabled={currentPath === '/' || currentPath === ''}
            style={{
              ...btnStyle,
              opacity: currentPath === '/' || currentPath === '' ? 0.3 : 1,
              cursor: currentPath === '/' || currentPath === '' ? 'default' : 'pointer',
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {currentPath || '/'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setShowCreateFolder(!showCreateFolder)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--color-border-glass)',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            <span>Create Folder</span>
          </button>
          
          <button
            onClick={() => {
              const fileContent = prompt('Enter text file content:');
              if (fileContent !== null) {
                const fileName = prompt('Enter filename (e.g. data.txt):', 'data.txt');
                if (fileName && fileName.endsWith('.txt')) {
                  setFileSystem((prev) => {
                    const addFile = (node: FileSystemNode): FileSystemNode => {
                      if (node.path === currentPath) {
                        return {
                          ...node,
                          children: [
                            ...(node.children || []),
                            {
                              name: fileName,
                              path: `${currentPath}/${fileName}`.replace(/\/+/g, '/'),
                              isFolder: false,
                              content: fileContent,
                            },
                          ],
                        };
                      }
                      if (node.children) {
                        return { ...node, children: node.children.map(addFile) };
                      }
                      return node;
                    };
                    return addFile(prev);
                  });
                }
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              color: 'var(--color-accent-cyan)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <ArrowUp size={14} />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Create Folder Modal popup inside window */}
      {showCreateFolder && (
        <div
          style={{
            padding: '16px',
            background: 'rgba(5, 9, 20, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            animation: 'fade-down 0.2s ease',
          }}
        >
          <input
            type="text"
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
          <button
            onClick={handleCreateFolder}
            style={{
              background: 'var(--color-accent-cyan)',
              border: 'none',
              color: '#020617',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Create
          </button>
          <button
            onClick={() => setShowCreateFolder(false)}
            style={{
              background: 'none',
              border: '1px solid var(--color-border-glass)',
              color: '#f8fafc',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Directory Grid */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '20px' }}>
          {items.map((item) => (
            <div
              key={item.name}
              onDoubleClick={() => handleNavigate(item)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '12px 8px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid transparent',
                transition: 'var(--transition-fast)',
              }}
              className="grid-item-explorer"
            >
              {item.isFolder ? (
                <Folder size={40} style={{ color: 'var(--color-accent-blue-bright)', filter: 'drop-shadow(0 4px 10px rgba(37,99,235,0.2))' }} />
              ) : (
                <FileText size={40} style={{ color: 'var(--color-accent-cyan)', filter: 'drop-shadow(0 4px 10px rgba(6,182,212,0.2))' }} />
              )}
              <span
                style={{
                  fontSize: '12px',
                  color: '#cbd5e1',
                  marginTop: '8px',
                  wordBreak: 'break-all',
                  maxWidth: '90px',
                  lineHeight: '1.3',
                }}
              >
                {item.name}
              </span>

              {/* Hover actions panel */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '8px',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
                className="hover-actions"
              >
                {!item.isFolder && (
                  <button
                    onClick={() => {
                      onOpenFileInNotepad();
                    }}
                    style={iconActionBtnStyle}
                    title="Edit Note"
                  >
                    <Edit3 size={11} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.name);
                  }}
                  style={iconActionBtnStyle}
                  className="delete-btn-explorer"
                  title="Delete Item"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px', paddingTop: '40px' }}>
              This folder is empty. Create a new folder or upload mock files above.
            </div>
          )}
        </div>
      </div>

      <style>{`
        .grid-item-explorer:hover {
          background: rgba(255,255,255,0.03) !important;
          border-color: rgba(255,255,255,0.05) !important;
        }
        .grid-item-explorer:hover .hover-actions {
          opacity: 1 !important;
        }
        .delete-btn-explorer:hover {
          color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.1) !important;
          border-color: rgba(239, 68, 68, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#cbd5e1',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'var(--transition-fast)',
};

const iconActionBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'var(--color-text-secondary)',
  padding: '4px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
export default DriveApp;
