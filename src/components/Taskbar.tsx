import { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2, ChevronUp } from 'lucide-react';
import { WindowState, WindowId } from '@/types/window';
import { StartMenu } from './StartMenu';

interface TaskbarProps {
  windows: WindowState[];
  onWindowClick: (id: string) => void;
  onOpenWindow: (id: WindowId) => void;
}

export function Taskbar({ windows, onWindowClick, onOpenWindow }: TaskbarProps) {
  const [time, setTime] = useState(new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Start Menu */}
      <StartMenu 
        isOpen={isStartMenuOpen} 
        onClose={() => setIsStartMenuOpen(false)}
        onOpenWindow={onOpenWindow}
      />

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 taskbar-glass flex items-center justify-between px-2 z-[1000]">
        {/* Left section - Start button and pinned apps */}
        <div className="flex items-center gap-1">
          {/* Start Button */}
          <button
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 ${
              isStartMenuOpen ? 'bg-secondary' : 'hover:bg-secondary/60'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-primary">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* Open Windows */}
          <div className="flex items-center gap-1">
            {windows.map((window) => (
              <button
                key={window.id}
                onClick={() => onWindowClick(window.id)}
                className={`h-10 px-3 flex items-center gap-2 rounded-lg transition-all duration-150 ${
                  !window.isMinimized
                    ? 'bg-secondary/80 border-b-2 border-primary'
                    : 'hover:bg-secondary/60'
                }`}
              >
                <span className="text-lg">{window.icon}</span>
                <span className="text-sm font-medium max-w-24 truncate hidden md:inline">
                  {window.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Center section - can be used for search */}
        <div className="hidden md:flex items-center">
          {/* Optional center content */}
        </div>

        {/* Right section - System tray */}
        <div className="flex items-center gap-1">
          <button className="icon-hover p-2">
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <div className="flex items-center gap-2 px-2 py-1 icon-hover">
            <Wifi className="w-4 h-4 text-muted-foreground" />
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Battery className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex flex-col items-end px-3 py-1 icon-hover">
            <span className="text-xs text-foreground">{formatTime(time)}</span>
            <span className="text-xs text-muted-foreground">{formatDate(time)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
