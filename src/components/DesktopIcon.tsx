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
      className={`desktop-icon w-20 text-center focus:outline-none ${
        isSelected ? 'bg-primary/20 ring-1 ring-primary/40' : ''
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      <div className="text-4xl mb-1 drop-shadow-md transition-transform hover:scale-110">
        {icon}
      </div>
      <span className="text-xs font-medium text-foreground/90 leading-tight line-clamp-2 drop-shadow-sm">
        {title}
      </span>
    </button>
  );
}
