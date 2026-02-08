import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { StartMenu } from './StartMenu';
import { SystemTray } from './SystemTray';
import { WindowState, WindowId } from '@/types/window';

interface TaskbarProps {
  windows: WindowState[];
  onWindowClick: (id: string) => void;
  onOpenWindow: (id: WindowId) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function Taskbar({ 
  windows, 
  onWindowClick, 
  onOpenWindow, 
  isDarkMode, 
  onToggleTheme,
  isMuted,
  onToggleMute 
}: TaskbarProps) {
  const [isStartOpen, setIsStartOpen] = useState(false);

  return (
    <>
      {/* Start Menu */}
      <StartMenu
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        onOpenWindow={(id) => {
          onOpenWindow(id);
          setIsStartOpen(false);
        }}
      />

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 taskbar-glass flex items-center justify-between px-2 z-[500]">
        {/* Left section - Start button and Search */}
        <div className="flex items-center gap-1">
          {/* Start Button */}
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
              isStartOpen 
                ? 'bg-primary/20' 
                : 'hover:bg-primary/10'
            }`}
            title="Start"
          >
            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
              <div className="bg-primary rounded-sm" />
              <div className="bg-primary rounded-sm" />
              <div className="bg-primary rounded-sm" />
              <div className="bg-primary rounded-sm" />
            </div>
          </button>

          {/* Search */}
          <button className="h-9 px-3 flex items-center gap-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Center section - Running apps */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {windows.map((window) => (
            <button
              key={window.id}
              onClick={() => onWindowClick(window.id)}
              className={`h-10 px-3 flex items-center gap-2 rounded-lg transition-all duration-200 min-w-[44px] ${
                !window.isMinimized
                  ? 'bg-primary/20 border-b-2 border-primary'
                  : 'hover:bg-primary/10'
              }`}
              title={window.title}
            >
              <span className="text-lg">{window.icon}</span>
              <span className="text-sm max-w-24 truncate hidden sm:inline">
                {window.title}
              </span>
            </button>
          ))}
        </div>

        {/* Right section - System tray */}
        <SystemTray 
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
        />
      </div>
    </>
  );
}
