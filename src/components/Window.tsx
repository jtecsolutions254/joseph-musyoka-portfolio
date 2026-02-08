import { useState, useRef, useEffect } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import { WindowState } from '@/types/window';

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

  const style = window.isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 48px)',
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
      className="fixed window-glass rounded-lg overflow-hidden animate-window-open flex flex-col"
      style={style}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-card flex items-center justify-between px-4 cursor-move shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{window.icon}</span>
          <span className="text-sm font-medium text-foreground/90">{window.title}</span>
        </div>

        <div className="window-controls flex">
          <button
            onClick={onMinimize}
            className="window-control-minimize"
            title="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onMaximize}
            className="window-control-maximize"
            title={window.isMaximized ? 'Restore' : 'Maximize'}
          >
            {window.isMaximized ? (
              <Copy className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={onClose}
            className="window-control-close"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-card p-6">
        {children}
      </div>
    </div>
  );
}
