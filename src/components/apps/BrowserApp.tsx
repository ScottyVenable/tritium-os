import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Bookmark, Globe } from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [bookmarks] = useState([
    { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { name: 'Google Search', url: 'https://www.google.com/search?igu=1' },
    { name: 'Claude AI', url: 'https://claude.ai' },
    { name: 'Gemini', url: 'https://gemini.google.com' },
  ]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = inputUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    setUrl(targetUrl);
    setInputUrl(targetUrl);
  };

  const handleBookmarkClick = (bmUrl: string) => {
    setUrl(bmUrl);
    setInputUrl(bmUrl);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: '#0a0d16',
        color: '#f8fafc',
      }}
    >
      {/* Browser Controls Header */}
      <div
        style={{
          height: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 16px',
          background: 'rgba(0,0,0,0.15)',
        }}
      >
        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={btnStyle} disabled>
            <ArrowLeft size={14} />
          </button>
          <button style={btnStyle} disabled>
            <ArrowRight size={14} />
          </button>
          <button onClick={() => setUrl(url)} style={btnStyle}>
            <RotateCw size={14} />
          </button>
          <button onClick={() => { setUrl('https://www.wikipedia.org'); setInputUrl('https://www.wikipedia.org'); }} style={btnStyle}>
            <Home size={14} />
          </button>
        </div>

        {/* Address Bar Form */}
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
            }}
          >
            <Globe size={14} style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--color-accent-cyan)', cursor: 'pointer' }}>
              <Search size={14} />
            </button>
          </div>
        </form>
      </div>

      {/* Bookmarks Bar */}
      <div
        style={{
          height: '32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 16px',
          background: 'rgba(0,0,0,0.05)',
          fontSize: '11px',
        }}
      >
        <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Bookmark size={12} />
          <span>Bookmarks:</span>
        </span>
        {bookmarks.map((bm) => (
          <button
            key={bm.name}
            onClick={() => handleBookmarkClick(bm.url)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            {bm.name}
          </button>
        ))}
      </div>

      {/* Browser Viewport Frame */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#fff' }}>
        {url.includes('google.com') || url.includes('claude.ai') || url.includes('gemini.google.com') ? (
          // Custom interactive placeholder for frame-blocking URLs
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#040714',
              color: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Globe size={48} style={{ color: 'var(--color-accent-cyan)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Security Sandbox Container</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '400px', lineHeight: '1.5' }}>
              Tritium OS is emulating the active window wrapper. The address <strong>{url}</strong> employs framing policies that prevent embedded iFrame hosting.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{
                marginTop: '16px',
                background: 'var(--color-accent-cyan)',
                border: 'none',
                color: '#020617',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: 'var(--glow-cyan)',
              }}
            >
              Launch in Secure Native App
            </a>
          </div>
        ) : (
          <iframe
            src={url}
            title="Tritium Browser System"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#fff',
            }}
          />
        )}
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'var(--transition-fast)',
};
export default BrowserApp;
