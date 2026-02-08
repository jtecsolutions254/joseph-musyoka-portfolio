import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Wifi, ChevronUp } from 'lucide-react';

interface SystemTrayProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function SystemTray({ isDarkMode, onToggleTheme, isMuted, onToggleMute }: SystemTrayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTray, setShowTray] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div 
      className="flex items-center h-full"
      style={{
        background: 'linear-gradient(to bottom, #0f8df7 0%, #0978df 50%, #0560c2 51%, #0560c2 100%)',
        borderLeft: '1px solid #0c59b9',
        paddingLeft: '4px',
      }}
    >
      {/* Expand/Collapse */}
      <button
        onClick={() => setShowTray(!showTray)}
        className="w-5 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <ChevronUp className={`w-3 h-3 text-white/80 transition-transform ${showTray ? 'rotate-180' : ''}`} />
      </button>

      {/* Tray Icons */}
      <div className="flex items-center gap-0.5 px-1">
        {/* Volume */}
        <button
          onClick={onToggleMute}
          className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/90" />
          ) : (
            <Volume2 className="w-4 h-4 text-white/90" />
          )}
        </button>

        {/* Network */}
        <button className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded transition-colors" title="Network">
          <Wifi className="w-4 h-4 text-white/90" />
        </button>

        {/* Shield icon (decorative) */}
        <div className="w-5 h-5 flex items-center justify-center" title="Security">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/90" fill="currentColor">
            <path d="M12 2L4 6v6c0 5.25 3.4 10.2 8 12 4.6-1.8 8-6.75 8-12V6l-8-4z"/>
          </svg>
        </div>
      </div>

      {/* Clock */}
      <div 
        className="h-full flex items-center px-2 min-w-[70px] justify-center"
        style={{
          background: 'linear-gradient(to bottom, #1290f5 0%, #0978df 50%, #0563c4 51%, #0563c4 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span className="text-[11px] text-white font-normal">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
}
