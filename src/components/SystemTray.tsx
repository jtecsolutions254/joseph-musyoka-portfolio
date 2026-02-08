import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Wifi, ChevronUp, Moon, Sun, Shield, Bluetooth, Battery } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SystemTrayProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function SystemTray({ isDarkMode, onToggleTheme, isMuted, onToggleMute }: SystemTrayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTray, setShowTray] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close quick settings when clicking outside
  useEffect(() => {
    if (!showQuickSettings) return;
    const handleClick = () => setShowQuickSettings(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showQuickSettings]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div 
      className="flex items-center h-full relative"
      style={{
        background: 'linear-gradient(to bottom, #0f8df7 0%, #0978df 50%, #0560c2 51%, #0560c2 100%)',
        borderLeft: '1px solid #0c59b9',
        paddingLeft: '4px',
      }}
    >
      {/* Quick Settings Popup */}
      {showQuickSettings && (
        <div 
          className="absolute bottom-full right-0 mb-1 w-[280px] rounded-lg shadow-xl overflow-hidden z-[1000]"
          style={{
            background: 'linear-gradient(180deg, #ece9d8 0%, #d4d0c8 100%)',
            border: '2px solid #0054e3',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="px-3 py-2 text-white text-sm font-bold"
            style={{
              background: 'linear-gradient(180deg, #0a5dcc 0%, #0347a7 50%, #003d8c 100%)',
            }}
          >
            Quick Settings
          </div>
          
          {/* Settings Grid */}
          <div className="p-3 grid grid-cols-3 gap-2">
            {/* WiFi */}
            <button 
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-[#316ac5]/20 transition-colors"
              title="WiFi Connected"
            >
              <div className="w-10 h-10 rounded-full bg-[#316ac5] flex items-center justify-center">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-gray-700">WiFi</span>
            </button>
            
            {/* Bluetooth */}
            <button 
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-[#316ac5]/20 transition-colors"
              title="Bluetooth"
            >
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
                <Bluetooth className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-gray-700">Bluetooth</span>
            </button>
            
            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme}
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-[#316ac5]/20 transition-colors"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#316ac5]' : 'bg-gray-400'}`}>
                {isDarkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
              </div>
              <span className="text-[10px] text-gray-700">{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
            
            {/* Volume */}
            <button 
              onClick={onToggleMute}
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-[#316ac5]/20 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMuted ? 'bg-gray-400' : 'bg-[#316ac5]'}`}>
                {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </div>
              <span className="text-[10px] text-gray-700">{isMuted ? 'Muted' : 'Sound'}</span>
            </button>
            
            {/* Battery */}
            <button 
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-[#316ac5]/20 transition-colors"
              title="Battery: 100%"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Battery className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-gray-700">100%</span>
            </button>
            
            {/* Security */}
            <button 
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-[#316ac5]/20 transition-colors"
              title="Security: Protected"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-gray-700">Secure</span>
            </button>
          </div>
          
          {/* Date Display */}
          <div className="px-3 py-2 border-t border-gray-300 text-center">
            <span className="text-xs text-gray-600">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      )}

      {/* Expand/Collapse Hidden Icons */}
      <button
        onClick={() => setShowTray(!showTray)}
        className={`${isMobile ? 'w-7 h-7' : 'w-5 h-full'} flex items-center justify-center hover:bg-white/10 transition-colors`}
        title="Show hidden icons"
      >
        <ChevronUp className={`w-3 h-3 text-white/80 transition-transform ${showTray ? 'rotate-180' : ''}`} />
      </button>

      {/* Tray Icons */}
      <div className={`flex items-center gap-0.5 px-1 ${showTray ? '' : ''}`}>
        {/* Extra icons when expanded */}
        {showTray && (
          <>
            <button
              onClick={onToggleTheme}
              className={`${isMobile ? 'w-7 h-7' : 'w-5 h-5'} flex items-center justify-center hover:bg-white/10 rounded transition-colors`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-white/90" />
              ) : (
                <Sun className="w-4 h-4 text-white/90" />
              )}
            </button>
            <button
              className={`${isMobile ? 'w-7 h-7' : 'w-5 h-5'} flex items-center justify-center hover:bg-white/10 rounded transition-colors`}
              title="Bluetooth Off"
            >
              <Bluetooth className="w-4 h-4 text-white/60" />
            </button>
          </>
        )}
        
        {/* Volume */}
        <button
          onClick={onToggleMute}
          className={`${isMobile ? 'w-7 h-7' : 'w-5 h-5'} flex items-center justify-center hover:bg-white/10 rounded transition-colors`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/90" />
          ) : (
            <Volume2 className="w-4 h-4 text-white/90" />
          )}
        </button>

        {/* Network */}
        <button 
          className={`${isMobile ? 'w-7 h-7' : 'w-5 h-5'} flex items-center justify-center hover:bg-white/10 rounded transition-colors`} 
          title="Network Connected"
        >
          <Wifi className="w-4 h-4 text-white/90" />
        </button>

        {/* Shield icon */}
        <button 
          className={`${isMobile ? 'w-7 h-7' : 'w-5 h-5'} flex items-center justify-center hover:bg-white/10 rounded transition-colors`} 
          title="Security: Protected"
        >
          <Shield className="w-4 h-4 text-white/90" />
        </button>
      </div>

      {/* Clock - clickable to show quick settings */}
      <button 
        className="h-full flex items-center px-2 min-w-[70px] justify-center hover:bg-white/10 transition-colors"
        style={{
          background: 'linear-gradient(to bottom, #1290f5 0%, #0978df 50%, #0563c4 51%, #0563c4 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowQuickSettings(!showQuickSettings);
        }}
        title="Click for quick settings"
      >
        <span className="text-[11px] text-white font-normal">
          {formatTime(currentTime)}
        </span>
      </button>
    </div>
  );
}
