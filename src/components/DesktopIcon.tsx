import { useState } from 'react';
import { WindowId } from '@/types/window';

interface DesktopIconProps {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  onDoubleClick: () => void;
}

export function DesktopIcon({ id, title, icon, onClick, onDoubleClick }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(true);
    onClick();
  };

  const handleDoubleClick = () => {
    onDoubleClick();
  };

  const handleBlur = () => {
    setIsSelected(false);
  };

  return (
    <button
      className={`w-20 flex flex-col items-center gap-1 p-2 rounded focus:outline-none transition-all ${
        isSelected 
          ? 'bg-[#316ac5]/60 ring-1 ring-[#316ac5] ring-offset-0' 
          : 'hover:bg-white/20'
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      <div className="transition-transform hover:scale-105">
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
