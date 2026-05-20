import React, { useEffect, useState } from 'react';
import { Keyboard, MousePointer, X, Info, TouchpadOff } from 'lucide-react';
import type { PeripheralStatus } from '../types/os';

interface PeripheralsPopupProps {
  status: PeripheralStatus;
  setStatus: React.Dispatch<React.SetStateAction<PeripheralStatus>>;
}

export const PeripheralsPopup: React.FC<PeripheralsPopupProps> = ({
  status,
  setStatus,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Automatically trigger visual display on startup
    const timer = setTimeout(() => {
      if (!status.popupDismissed) {
        setVisible(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [status.popupDismissed]);

  // Monitor hardware links dynamically
  useEffect(() => {
    const handleMouseMove = () => {
      if (!status.hasMouse) {
        setStatus((prev) => ({ ...prev, hasMouse: true }));
      }
    };

    const handleKeyDown = () => {
      if (!status.hasKeyboard) {
        setStatus((prev) => ({ ...prev, hasKeyboard: true }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status.hasMouse, status.hasKeyboard, setStatus]);

  if (!visible || status.popupDismissed) return null;

  const handleDismiss = () => {
    setVisible(false);
    setStatus((prev) => ({ ...prev, popupDismissed: true }));
  };

  const peripheralsDetected = status.hasKeyboard || status.hasMouse;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        width: '340px',
        animation: 'slide-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      <div
        className="glass-panel-heavy"
        style={{
          borderRadius: '20px',
          border: `1.5px solid ${peripheralsDetected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(37, 99, 235, 0.25)'}`,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'rgba(5, 9, 20, 0.9)',
          boxShadow: peripheralsDetected
            ? '0 15px 35px rgba(16, 185, 129, 0.15)'
            : '0 15px 35px rgba(37, 99, 235, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {peripheralsDetected ? (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            ) : (
              <Info size={16} style={{ color: 'var(--color-accent-blue-bright)' }} />
            )}
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', letterSpacing: '0.02em' }}>
              {peripheralsDetected ? 'Hardware Link Established' : 'Desktop Mode Recommendation'}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
          {peripheralsDetected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span>Nice, you have your peripherals connected. Tritium OS detects active inputs:</span>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                {status.hasKeyboard && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                    <Keyboard size={12} />
                    <span>Keyboard</span>
                  </span>
                )}
                {status.hasMouse && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                    <MousePointer size={12} />
                    <span>Mouse</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span>For the best desktop shell experience, it is recommended to connect a physical keyboard and a mouse.</span>
              <div
                style={{
                  padding: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '10px',
                  marginTop: '4px',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <TouchpadOff size={16} style={{ color: 'var(--color-accent-blue-bright)', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Touch Trackpad Active:</strong> Dragging one finger on the screen will slide a responsive mouse pointer. Tap to click, double-tap to maximize.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleDismiss}
          style={{
            background: peripheralsDetected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(37, 99, 235, 0.15)',
            border: `1px solid ${peripheralsDetected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
            color: peripheralsDetected ? '#10b981' : 'var(--color-accent-blue-bright)',
            padding: '8px 0',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = peripheralsDetected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(37, 99, 235, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = peripheralsDetected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(37, 99, 235, 0.15)';
          }}
        >
          Acknowledge
        </button>
      </div>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
