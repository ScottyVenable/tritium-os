import React from 'react';
import { Download, Check, Sparkles, Monitor, Globe, BookOpen, Music, Code } from 'lucide-react';

interface AppPackage {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  url: string;
}

interface AppStoreProps {
  installedApps: string[];
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
}

export const AppStore: React.FC<AppStoreProps> = ({
  installedApps,
  onInstall,
  onUninstall,
}) => {
  const packages: AppPackage[] = [
    {
      id: 'chrome',
      name: 'Google Chrome',
      category: 'Utilities',
      description: 'Dynamic sandbox web navigator compiled inside window environments.',
      iconName: 'chrome',
      url: 'https://www.google.com/search?igu=1',
    },
    {
      id: 'obsidian',
      name: 'Obsidian Web',
      category: 'Productivity',
      description: 'Second-brain documentation editor linking ideas through custom markdown nodes.',
      iconName: 'book',
      url: 'https://obsidian.md',
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      category: 'Intelligence',
      description: 'Advanced chatbot interface natively linked directly to Google Assistant frameworks.',
      iconName: 'gemini',
      url: 'https://gemini.google.com',
    },
    {
      id: 'claude',
      name: 'Claude App',
      category: 'Intelligence',
      description: 'Generative AI interface with highly articulate writing and coding reasoning structures.',
      iconName: 'claude',
      url: 'https://claude.ai',
    },
    {
      id: 'vscode',
      name: 'VS Code Web',
      category: 'Development',
      description: 'Full-featured developer code editor running completely client-side in window views.',
      iconName: 'code',
      url: 'https://github.dev',
    },
    {
      id: 'spotify',
      name: 'Spotify Web Player',
      category: 'Entertainment',
      description: 'Digital audio stream streaming dynamic playlists directly inside glassmorphic HUDs.',
      iconName: 'music',
      url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX10zKzsJ2jva',
    },
  ];

  const getPackageIcon = (iconName: string) => {
    switch (iconName) {
      case 'chrome':
        return <Globe size={28} style={{ color: '#4285F4' }} />;
      case 'book':
        return <BookOpen size={28} style={{ color: '#a855f7' }} />;
      case 'gemini':
        return <Sparkles size={28} style={{ color: '#3b82f6' }} />;
      case 'claude':
        return <Sparkles size={28} style={{ color: '#f97316' }} />;
      case 'code':
        return <Code size={28} style={{ color: '#007ACC' }} />;
      case 'music':
        return <Music size={28} style={{ color: '#1DB954' }} />;
      default:
        return <Monitor size={28} style={{ color: 'var(--color-accent-cyan)' }} />;
    }
  };

  const handleToggleInstall = (id: string) => {
    if (installedApps.includes(id)) {
      onUninstall(id);
    } else {
      onInstall(id);
    }
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
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
          Tritium OS App Repository
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          Install customized sandboxed web wrappers and tools directly onto your desktop.
        </p>
      </div>

      {/* Package Grid List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {packages.map((pkg) => {
          const isInstalled = installedApps.includes(pkg.id);
          return (
            <div
              key={pkg.id}
              className="glass-panel-light"
              style={{
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                background: 'rgba(255,255,255,0.01)',
                transition: 'var(--transition-smooth)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {getPackageIcon(pkg.iconName)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', color: '#f8fafc', fontWeight: 600 }}>{pkg.name}</h3>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        color: 'var(--color-accent-cyan)',
                        background: 'rgba(6, 182, 212, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {pkg.category}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '6px', lineHeight: '1.4' }}>
                    {pkg.description}
                  </p>
                </div>
              </div>

              {/* Install Action Toggle button */}
              <button
                onClick={() => handleToggleInstall(pkg.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 0',
                  borderRadius: '10px',
                  border: isInstalled ? '1px solid rgba(6, 182, 212, 0.3)' : 'none',
                  background: isInstalled ? 'rgba(6, 182, 212, 0.08)' : 'var(--color-accent-cyan)',
                  color: isInstalled ? 'var(--color-accent-cyan)' : '#020617',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  boxShadow: isInstalled ? 'none' : 'var(--glow-cyan)',
                }}
              >
                {isInstalled ? (
                  <>
                    <Check size={14} />
                    <span>Package Installed</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Download Package</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AppStore;
