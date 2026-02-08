import { useState, useRef, useEffect } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import { WindowState } from '@/types/window';
import { useIsMobile } from '@/hooks/use-mobile';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export function Window({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  children,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    });
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.innerWidth - 200));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, globalThis.innerHeight - 100));
      
      onUpdatePosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onUpdatePosition]);

  if (window.isMinimized) return null;

  // Mobile: always maximize windows for better usability
  const isEffectivelyMaximized = isMobile || window.isMaximized;

  const style = isEffectivelyMaximized
    ? {
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 40px)', // Slightly taller taskbar area for touch
        zIndex: window.zIndex,
      }
    : {
        top: window.position.y,
        left: window.position.x,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="fixed overflow-hidden animate-window-open flex flex-col"
      style={{
        ...style,
        borderRadius: '8px 8px 0 0',
        border: '1px solid #0054e3',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.4)',
      }}
      onClick={onFocus}
    >
      {/* XP-style Title Bar */}
      <div
        className={`h-[36px] md:h-[30px] flex items-center justify-between px-2 shrink-0 ${!isMobile ? 'cursor-move' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #0a5dcc 0%, #0347a7 8%, #0453bf 40%, #0861d4 88%, #0553bf 93%, #003d8c 95%, #002d6a 100%)',
          borderRadius: '6px 6px 0 0',
        }}
        onMouseDown={!isMobile ? handleMouseDown : undefined}
        onTouchStart={(e) => {
          // Allow touch scrolling within the window
          e.stopPropagation();
        }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-base shrink-0">{window.icon}</span>
          <span className="text-[13px] font-bold text-white drop-shadow-sm truncate">{window.title}</span>
        </div>

        <div className="window-controls flex gap-1 shrink-0">
          {/* XP Minimize button - larger touch targets on mobile */}
          <button
            onClick={onMinimize}
            className={`${isMobile ? 'w-[32px] h-[32px]' : 'w-[21px] h-[21px]'} flex items-center justify-center rounded-sm transition-all`}
            style={{
              background: 'linear-gradient(180deg, #3c8dfa 0%, #1c6ae4 50%, #1865dc 51%, #1761d8 100%)',
              border: '1px solid #0f419b',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
            title="Minimize"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #5ca7ff 0%, #3c8dfa 50%, #2c7df0 51%, #2679ec 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #3c8dfa 0%, #1c6ae4 50%, #1865dc 51%, #1761d8 100%)';
            }}
          >
            <Minus className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-white drop-shadow-sm`} />
          </button>
          {/* XP Maximize button - hidden on mobile since always maximized */}
          {!isMobile && (
            <button
              onClick={onMaximize}
              className="w-[21px] h-[21px] flex items-center justify-center rounded-sm transition-all"
              style={{
                background: 'linear-gradient(180deg, #3c8dfa 0%, #1c6ae4 50%, #1865dc 51%, #1761d8 100%)',
                border: '1px solid #0f419b',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
              title={window.isMaximized ? 'Restore' : 'Maximize'}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #5ca7ff 0%, #3c8dfa 50%, #2c7df0 51%, #2679ec 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #3c8dfa 0%, #1c6ae4 50%, #1865dc 51%, #1761d8 100%)';
              }}
            >
              {window.isMaximized ? (
                <Copy className="w-2.5 h-2.5 text-white drop-shadow-sm" />
              ) : (
                <Square className="w-2.5 h-2.5 text-white drop-shadow-sm" />
              )}
            </button>
          )}
          {/* XP Close button - Red - larger on mobile */}
          <button
            onClick={onClose}
            className={`${isMobile ? 'w-[32px] h-[32px]' : 'w-[21px] h-[21px]'} flex items-center justify-center rounded-sm transition-all`}
            style={{
              background: 'linear-gradient(180deg, #e88a7c 0%, #d65f4b 50%, #c94530 51%, #b53520 100%)',
              border: '1px solid #8b2518',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
            title="Close"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #ffaa9c 0%, #e87060 50%, #dc5540 51%, #c84535 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #e88a7c 0%, #d65f4b 50%, #c94530 51%, #b53520 100%)';
            }}
          >
            <X className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-white drop-shadow-sm`} />
          </button>
        </div>
      </div>

      {/* Content - with touch-friendly scrolling */}
      <div className="flex-1 overflow-auto bg-[#ece9d8] p-4 md:p-6 overscroll-contain touch-pan-y">
        {children}
      </div>
    </div>
  );
}
