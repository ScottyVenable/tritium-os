import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png';
import { Unlock, Cpu, ChevronRight } from 'lucide-react';
import type { OSSettings } from '../types/os';

interface LockScreenProps {
  onUnlock: () => void;
  isUnlocked: boolean;
  settings?: OSSettings;
  setSettings?: React.Dispatch<React.SetStateAction<OSSettings>>;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onUnlock,
  isUnlocked,
  settings,
  setSettings,
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  // Swipeable Notification States
  const [notifOffset, setNotifOffset] = useState(0);
  const [isNotifSwiping, setIsNotifSwiping] = useState(false);
  const notifTouchStartX = useRef(0);

  // Slide to Unlock States
  const [sliderX, setSliderX] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const sliderStartX = useRef(0);
  const maxSliderOffset = 300 - 48 - 8; // 244px total movement range

  const clock12h = settings ? settings.clock12h !== false : true;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: clock12h })
      );
      setDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [clock12h]);

  // Slide to Unlock handlers
  const handleSliderStart = (clientX: number) => {
    if (isUnlocking) return;
    setIsSliding(true);
    sliderStartX.current = clientX - sliderX;
  };

  const handleSliderMove = (clientX: number) => {
    if (!isSliding || isUnlocking) return;
    const currentOffset = clientX - sliderStartX.current;
    const clamped = Math.max(0, Math.min(maxSliderOffset, currentOffset));
    setSliderX(clamped);
  };

  const handleSliderEnd = () => {
    if (!isSliding) return;
    setIsSliding(false);
    const percent = sliderX / maxSliderOffset;
    if (percent >= 0.85) {
      setSliderX(maxSliderOffset);
      setIsUnlocking(true);
      setTimeout(() => {
        onUnlock();
        setIsUnlocking(false);
        setSliderX(0);
      }, 800);
    } else {
      setSliderX(0);
    }
  };

  // Swipe Notification handlers
  const handleNotifStart = (clientX: number) => {
    notifTouchStartX.current = clientX;
    setIsNotifSwiping(true);
  };

  const handleNotifMove = (clientX: number) => {
    if (!isNotifSwiping) return;
    const offset = clientX - notifTouchStartX.current;
    setNotifOffset(offset);
  };

  const handleNotifEnd = () => {
    if (!isNotifSwiping) return;
    setIsNotifSwiping(false);
    if (Math.abs(notifOffset) > 120) {
      setNotifOffset(notifOffset > 0 ? 500 : -500);
      setTimeout(() => {
        setShowNotification(false);
      }, 300);
    } else {
      setNotifOffset(0);
    }
  };

  const handleUnlockClick = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
      setIsUnlocking(false);
    }, 800);
  };

  if (isUnlocked && !isUnlocking) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'radial-gradient(circle at 50% 50%, #030712 0%, #02050c 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 20px',
        color: '#f8fafc',
        opacity: isUnlocked ? 0 : 1,
        transform: isUnlocked ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease-in-out',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(rgba(18, 24, 38, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 24, 38, 0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* Sleep Screen Top Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.05em',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={14} style={{ color: 'var(--color-accent-cyan)' }} />
          <span>TRITIUM CORE v2.0.1</span>
        </div>
        <div>SECURE LINK ACTIVE</div>
      </div>

      {/* Clock Area */}
      <div
        onClick={() => {
          if (setSettings) {
            setSettings((prev) => ({ ...prev, clock12h: !prev.clock12h }));
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        title="Click to toggle 12h/24h format"
      >
        <h1
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '96px',
            fontWeight: 500,
            margin: '0',
            lineHeight: '1',
            letterSpacing: '-0.03em',
            textShadow: '0 0 40px rgba(6, 182, 212, 0.15)',
          }}
        >
          {time}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            color: 'var(--color-text-secondary)',
            fontWeight: 400,
            marginTop: '8px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {date}
        </p>
      </div>

      {/* Main Glowing Crystalline Logo */}
      <div
        onClick={handleUnlockClick}
        style={{
          position: 'relative',
          width: '240px',
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.4s cubic-bezier(0.2, 1, 0.2, 1)',
        }}
        className="logo-container"
      >
        {/* Neon Backing Rings */}
        <div
          style={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            border: '2px dashed rgba(6, 182, 212, 0.12)',
            borderRadius: '50%',
            animation: 'spin-counter 20s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            border: '1px dashed rgba(37, 99, 235, 0.15)',
            borderRadius: '50%',
            animation: 'spin 12s linear infinite',
          }}
        />

        {/* Outer Halo */}
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animation: 'pulse-glow 4s ease-in-out infinite alternate',
          }}
        />

        {/* Tritium Crystal Logo Asset */}
        <img
          src={logo}
          alt="Tritium logo"
          style={{
            width: '160px',
            height: '160px',
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 0 25px rgba(37, 99, 235, 0.45)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.3))',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) rotate(2deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          }}
        />
      </div>

      {/* Interactive Bottom Notifications / Action Center */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {showNotification && (
          <div
            className="glass-panel-light"
            onTouchStart={(e) => handleNotifStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleNotifMove(e.touches[0].clientX)}
            onTouchEnd={handleNotifEnd}
            onMouseDown={(e) => handleNotifStart(e.clientX)}
            onMouseMove={(e) => handleNotifMove(e.clientX)}
            onMouseUp={handleNotifEnd}
            onMouseLeave={handleNotifEnd}
            style={{
              padding: '12px 18px',
              borderRadius: '16px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13px',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              transform: `translateX(${notifOffset}px)`,
              transition: isNotifSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease',
              opacity: Math.max(0, 1 - Math.abs(notifOffset) / 300),
              cursor: isNotifSwiping ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-cyan)',
              }}
            >
              <Cpu size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, color: '#f8fafc' }}>Tritium Core Intelligence</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Secure shell active. Swipe horizontally to dismiss notification.
              </div>
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
                paddingRight: '4px',
              }}
            >
              Swipe
            </div>
          </div>
        )}

        {/* iOS-style Slide to Unlock slider */}
        <div
          onTouchStart={(e) => handleSliderStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
          onTouchEnd={handleSliderEnd}
          onMouseDown={(e) => handleSliderStart(e.clientX)}
          onMouseMove={(e) => handleSliderMove(e.clientX)}
          onMouseUp={handleSliderEnd}
          onMouseLeave={handleSliderEnd}
          style={{
            width: '300px',
            height: '56px',
            borderRadius: '28px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--color-border-glass)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-dock)',
            touchAction: 'none',
            cursor: isSliding ? 'grabbing' : 'pointer',
          }}
        >
          {/* Shimmering unlock guide text */}
          <span
            className="shimmer-text"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              opacity: isSliding ? 0.3 : 0.8,
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
              marginLeft: '24px',
            }}
          >
            SLIDE TO UNLOCK
          </span>

          {/* Sliding track handle */}
          <div
            style={{
              position: 'absolute',
              left: `calc(4px + ${sliderX}px)`,
              width: '48px',
              height: '48px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--color-accent-cyan), #2563eb)',
              boxShadow: 'var(--glow-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#020617',
              transition: isSliding ? 'none' : 'left 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              cursor: 'grab',
            }}
          >
            {isUnlocking ? (
              <Unlock size={18} className="spinning-icon" />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-counter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes bounce-light {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .spinning-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
