import { useState, useRef } from 'react';
import { WindowId } from '@/types/window';

interface DesktopIconProps {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  onDoubleClick: () => void;
  isMobile?: boolean;
}

export function DesktopIcon({ id, title, icon, onClick, onDoubleClick, isMobile = false }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false);
  const lastTapRef = useRef<number>(0);

  const handleClick = () => {
    setIsSelected(true);
    onClick();
  };

  const handleDoubleClick = () => {
    onDoubleClick();
  };

  // Handle touch devices - single tap opens on mobile
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap
      onDoubleClick();
    } else {
      // Single tap - on mobile, single tap opens the window
      if (isMobile) {
        onDoubleClick();
      } else {
        handleClick();
      }
    }
    lastTapRef.current = now;
  };

  const handleBlur = () => {
    setIsSelected(false);
  };

  return (
    <button
      className={`${isMobile ? 'w-[72px] min-h-[80px]' : 'w-20'} flex flex-col items-center gap-1 p-2 rounded focus:outline-none transition-all touch-manipulation ${
        isSelected 
          ? 'bg-[#316ac5]/60 ring-1 ring-[#316ac5] ring-offset-0' 
          : 'hover:bg-white/20 active:bg-white/30'
      }`}
      onClick={!isMobile ? handleClick : undefined}
      onDoubleClick={!isMobile ? handleDoubleClick : undefined}
      onTouchEnd={handleTouchEnd}
      onBlur={handleBlur}
    >
      <div className={`transition-transform ${isMobile ? 'scale-90' : ''} hover:scale-105 active:scale-95`}>
        {icon}
      </div>
      <span 
        className={`text-[11px] font-normal leading-tight text-center line-clamp-2 px-0.5 ${
          isSelected 
            ? 'bg-[#316ac5] text-white' 
            : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
        }`}
        style={{ 
          textShadow: isSelected ? 'none' : '1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {title}
      </span>
    </button>
  );
}
