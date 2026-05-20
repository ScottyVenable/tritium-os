import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import type { OSWindow } from '../types/os';

interface WindowProps {
  window: OSWindow;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  activeWindowId: string;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window: osWindow,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  activeWindowId,
  children,
}) => {
  const { id, title, isMaximized, x, y, width, height, zIndex } = osWindow;
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  
  const dragStart = useRef({ x: 0, y: 0, windowX: 0, windowY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, windowX: 0, windowY: 0 });

  const isActive = activeWindowId === id;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    const target = e.target as HTMLElement;
    if (target.closest('.window-controls') || target.closest('.no-drag')) return;

    onFocus(id);
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      windowX: x,
      windowY: y,
    };
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized) return;
    const target = e.target as HTMLElement;
    if (target.closest('.window-controls') || target.closest('.no-drag')) return;

    onFocus(id);
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      windowX: x,
      windowY: y,
    };
  };

  const handleResizeMouseDown = (direction: string, e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus(id);
    setIsResizing(direction);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: width,
      h: height,
      windowX: x,
      windowY: y,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  const handleResizeTouchStart = (direction: string, e: React.TouchEvent) => {
    if (isMaximized) return;
    onFocus(id);
    setIsResizing(direction);
    const touch = e.touches[0];
    resizeStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      w: width,
      h: height,
      windowX: x,
      windowY: y,
    };
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;
        
        let newX = dragStart.current.windowX + deltaX;
        let newY = dragStart.current.windowY + deltaY;

        // Snapping and boundaries
        if (newY < 0) newY = 0; // Don't let header go above screen
        if (newY > window.innerHeight - 80) newY = window.innerHeight - 80;

        onMove(id, newX, newY);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        let newW = resizeStart.current.w;
        let newH = resizeStart.current.h;
        let newX = resizeStart.current.windowX;
        let newY = resizeStart.current.windowY;

        if (isResizing.includes('e')) {
          newW = Math.max(300, resizeStart.current.w + deltaX);
        }
        if (isResizing.includes('s')) {
          newH = Math.max(200, resizeStart.current.h + deltaY);
        }
        if (isResizing.includes('w')) {
          const potentialW = resizeStart.current.w - deltaX;
          if (potentialW >= 300) {
            newW = potentialW;
            newX = resizeStart.current.windowX + deltaX;
          }
        }
        if (isResizing.includes('n')) {
          const potentialH = resizeStart.current.h - deltaY;
          if (potentialH >= 200) {
            newH = potentialH;
            newY = resizeStart.current.windowY + deltaY;
          }
        }

        onResize(id, newW, newH);
        if (newX !== resizeStart.current.windowX || newY !== resizeStart.current.windowY) {
          onMove(id, newX, newY);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - dragStart.current.x;
        const deltaY = touch.clientY - dragStart.current.y;
        
        let newX = dragStart.current.windowX + deltaX;
        let newY = dragStart.current.windowY + deltaY;

        if (newY < 0) newY = 0;
        if (newY > window.innerHeight - 80) newY = window.innerHeight - 80;

        onMove(id, newX, newY);
      } else if (isResizing) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - resizeStart.current.x;
        const deltaY = touch.clientY - resizeStart.current.y;

        let newW = resizeStart.current.w;
        let newH = resizeStart.current.h;
        let newX = resizeStart.current.windowX;
        let newY = resizeStart.current.windowY;

        if (isResizing.includes('e')) {
          newW = Math.max(300, resizeStart.current.w + deltaX);
        }
        if (isResizing.includes('s')) {
          newH = Math.max(200, resizeStart.current.h + deltaY);
        }
        if (isResizing.includes('w')) {
          const potentialW = resizeStart.current.w - deltaX;
          if (potentialW >= 300) {
            newW = potentialW;
            newX = resizeStart.current.windowX + deltaX;
          }
        }
        if (isResizing.includes('n')) {
          const potentialH = resizeStart.current.h - deltaY;
          if (potentialH >= 200) {
            newH = potentialH;
            newY = resizeStart.current.windowY + deltaY;
          }
        }

        onResize(id, newW, newH);
        if (newX !== resizeStart.current.windowX || newY !== resizeStart.current.windowY) {
          onMove(id, newX, newY);
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isResizing, id, onMove, onResize, x, y, width, height, isMaximized]);

  return (
    <div
      ref={windowRef}
      style={{
        position: 'absolute',
        left: isMaximized ? 0 : x,
        top: isMaximized ? 0 : y,
        width: isMaximized ? '100vw' : width,
        height: isMaximized ? 'calc(100vh - var(--dock-height) - 32px)' : height,
        zIndex: zIndex,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: isMaximized ? '0' : '16px',
        overflow: 'hidden',
        transition: isDragging || isResizing ? 'none' : 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease',
        boxShadow: isActive ? 'var(--shadow-window)' : '0 10px 25px -10px rgba(0, 0, 0, 0.5)',
        border: isActive ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
        outline: isActive ? '1.5px solid rgba(6, 182, 212, 0.15)' : 'none',
      }}
      className="glass-panel window-container"
      onClick={() => onFocus(id)}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={() => !isMaximized && onMaximize(id)}
        className="window-header"
        style={{
          height: '44px',
          background: isActive ? 'rgba(10, 18, 36, 0.7)' : 'rgba(5, 9, 20, 0.5)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          cursor: isMaximized ? 'default' : 'move',
          color: isActive ? '#f8fafc' : '#94a3b8',
          fontFamily: 'var(--font-title)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.02em',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Active status indicator dot */}
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isActive ? 'var(--color-accent-cyan)' : 'transparent',
              boxShadow: isActive ? 'var(--glow-cyan)' : 'none',
              transition: 'var(--transition-smooth)',
            }}
          />
          <span>{title}</span>
        </div>

        {/* Window Controls */}
        <div className="window-controls" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => onMinimize(id)}
            style={controlButtonStyle}
            className="control-btn"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => onMaximize(id)}
            style={controlButtonStyle}
            className="control-btn"
          >
            <Square size={10} />
          </button>
          <button
            onClick={() => onClose(id)}
            style={controlButtonStyle}
            className="control-btn close-btn window-control-btn"
            title="Close Window"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div
        className="no-drag"
        style={{
          flex: 1,
          overflow: 'hidden',
          background: 'rgba(3, 7, 18, 0.35)',
          position: 'relative',
        }}
      >
        {children}
      </div>

      {/* Resizers */}
      {!isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown('e', e)}
            onTouchStart={(e) => handleResizeTouchStart('e', e)}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'ew-resize', zIndex: 10 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('s', e)}
            onTouchStart={(e) => handleResizeTouchStart('s', e)}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', cursor: 'ns-resize', zIndex: 10 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('w', e)}
            onTouchStart={(e) => handleResizeTouchStart('w', e)}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', cursor: 'ew-resize', zIndex: 10 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('n', e)}
            onTouchStart={(e) => handleResizeTouchStart('n', e)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', cursor: 'ns-resize', zIndex: 10 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('se', e)}
            onTouchStart={(e) => handleResizeTouchStart('se', e)}
            style={{ position: 'absolute', right: 0, bottom: 0, width: '12px', height: '12px', cursor: 'nwse-resize', zIndex: 11 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('sw', e)}
            onTouchStart={(e) => handleResizeTouchStart('sw', e)}
            style={{ position: 'absolute', left: 0, bottom: 0, width: '12px', height: '12px', cursor: 'nesw-resize', zIndex: 11 }}
          />
        </>
      )}

      <style>{`
        .control-btn {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          alignItems: center;
          justifyContent: center;
          transition: var(--transition-fast);
        }
        .control-btn:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.05);
        }
        .close-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          color: #f87171 !important;
        }
      `}</style>
    </div>
  );
};

const controlButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  color: 'var(--color-text-muted)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'var(--transition-fast)',
};
