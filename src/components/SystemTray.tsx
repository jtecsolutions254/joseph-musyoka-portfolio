import { useState, useEffect } from 'react';
import { Wifi, Volume2, VolumeX, Battery, BatteryCharging, Sun, Moon, ChevronUp } from 'lucide-react';

interface SystemTrayProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function SystemTray({ isDarkMode, onToggleTheme, isMuted, onToggleMute }: SystemTrayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(true);
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate battery
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => {
        if (isCharging) {
          return Math.min(100, prev + 1);
        }
        return Math.max(20, prev - 1);
      });
    }, 30000);
    return () => clearInterval(batteryInterval);
  }, [isCharging]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative">
      {/* System Tray Icons */}
      <div 
        className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-primary/10 cursor-pointer transition-colors"
        onClick={() => setShowQuickSettings(!showQuickSettings)}
      >
        {/* Hidden icons indicator */}
        <button className="p-1 hover:bg-primary/10 rounded transition-colors">
          <ChevronUp className="w-3 h-3 text-foreground/60" />
        </button>

        {/* Network */}
        <div className="p-1.5" title="Connected to Internet">
          <Wifi className="w-4 h-4 text-foreground/80" />
        </div>

        {/* Volume */}
        <button 
          className="p-1.5 hover:bg-primary/10 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-foreground/80" />
          ) : (
            <Volume2 className="w-4 h-4 text-foreground/80" />
          )}
        </button>

        {/* Battery */}
        <div className="p-1.5 flex items-center gap-1" title={`Battery: ${batteryLevel}%${isCharging ? ' (Charging)' : ''}`}>
          {isCharging ? (
            <BatteryCharging className="w-4 h-4 text-foreground/80" />
          ) : (
            <Battery className="w-4 h-4 text-foreground/80" />
          )}
          <span className="text-xs text-foreground/70">{batteryLevel}%</span>
        </div>

        {/* Date & Time */}
        <div className="pl-2 text-right">
          <div className="text-xs font-medium text-foreground/90">{formatTime(currentTime)}</div>
          <div className="text-xs text-foreground/60">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Quick Settings Panel */}
      {showQuickSettings && (
        <>
          <div 
            className="fixed inset-0 z-[999]" 
            onClick={() => setShowQuickSettings(false)} 
          />
          <div className="absolute bottom-full right-0 mb-2 w-80 glass-panel-strong rounded-xl p-4 animate-slide-up z-[1000] shadow-2xl">
            {/* Quick actions grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* WiFi */}
              <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors">
                <Wifi className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Wi-Fi</span>
              </button>

              {/* Bluetooth */}
              <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <svg className="w-5 h-5 text-foreground/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                </svg>
                <span className="text-xs font-medium">Bluetooth</span>
              </button>

              {/* Theme Toggle */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTheme();
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-primary/20 hover:bg-primary/30' : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-foreground/70" />
                )}
                <span className="text-xs font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
              </button>
            </div>

            {/* Brightness slider */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="75"
                  className="flex-1 h-1 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>
            </div>

            {/* Volume slider */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <button onClick={onToggleMute}>
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue={isMuted ? 0 : 50}
                  className="flex-1 h-1 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>
            </div>

            {/* Battery info */}
            <div className="flex items-center justify-between text-sm border-t border-border/50 pt-3">
              <div className="flex items-center gap-2">
                {isCharging ? (
                  <BatteryCharging className="w-4 h-4 text-green-500" />
                ) : (
                  <Battery className="w-4 h-4 text-foreground/70" />
                )}
                <span className="text-foreground/80">{batteryLevel}%</span>
                {isCharging && (
                  <span className="text-xs text-green-500">Charging</span>
                )}
              </div>
              <button 
                onClick={() => setIsCharging(!isCharging)}
                className="text-xs text-primary hover:underline"
              >
                Battery settings
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
