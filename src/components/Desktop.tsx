import { useState } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { WindowId } from '@/types/window';
import { useIsMobile } from '@/hooks/use-mobile';
import xpWallpaper from '@/assets/xp-wallpaper.jpg';

// XP-style SVG icons
const XPIcons = {
  myComputer: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <rect x="4" y="8" width="40" height="28" rx="2" fill="#c0c0c0" stroke="#808080" strokeWidth="1"/>
      <rect x="6" y="10" width="36" height="22" fill="#000080"/>
      <rect x="8" y="12" width="32" height="18" fill="#008080"/>
      <rect x="14" y="36" width="20" height="4" fill="#c0c0c0" stroke="#808080" strokeWidth="0.5"/>
      <rect x="10" y="40" width="28" height="3" rx="1" fill="#c0c0c0" stroke="#808080" strokeWidth="0.5"/>
      <circle cx="42" cy="38" r="1.5" fill="#00ff00"/>
    </svg>
  ),
  myDocuments: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <path d="M6 12 L6 40 L42 40 L42 16 L24 16 L20 12 Z" fill="#f4d03f" stroke="#c9a227" strokeWidth="1"/>
      <path d="M6 16 L42 16 L42 40 L6 40 Z" fill="#ffeaa7"/>
      <rect x="12" y="22" width="16" height="2" fill="#c9a227" opacity="0.5"/>
      <rect x="12" y="26" width="12" height="2" fill="#c9a227" opacity="0.5"/>
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <rect x="4" y="8" width="40" height="32" rx="2" fill="#4a90d9"/>
      <rect x="8" y="16" width="14" height="10" rx="1" fill="#fff" opacity="0.9"/>
      <rect x="26" y="16" width="14" height="10" rx="1" fill="#fff" opacity="0.9"/>
      <rect x="8" y="28" width="14" height="8" rx="1" fill="#fff" opacity="0.9"/>
      <rect x="26" y="28" width="14" height="8" rx="1" fill="#fff" opacity="0.9"/>
      <rect x="4" y="8" width="40" height="6" fill="#1e5799"/>
      <circle cx="8" cy="11" r="1.5" fill="#ff6b6b"/>
      <circle cx="13" cy="11" r="1.5" fill="#feca57"/>
      <circle cx="18" cy="11" r="1.5" fill="#48dbfb"/>
    </svg>
  ),
  resume: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <path d="M12 4 L36 4 L40 8 L40 44 L8 44 L8 8 Z" fill="#fff" stroke="#666" strokeWidth="1"/>
      <path d="M36 4 L36 8 L40 8" fill="#e0e0e0" stroke="#666" strokeWidth="1"/>
      <rect x="12" y="12" width="24" height="3" fill="#1e88e5"/>
      <rect x="12" y="18" width="20" height="2" fill="#999"/>
      <rect x="12" y="22" width="24" height="2" fill="#999"/>
      <rect x="12" y="26" width="18" height="2" fill="#999"/>
      <rect x="12" y="32" width="24" height="2" fill="#999"/>
      <rect x="12" y="36" width="16" height="2" fill="#999"/>
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <rect x="4" y="10" width="40" height="28" rx="2" fill="#f0e68c"/>
      <path d="M4 12 L24 26 L44 12" stroke="#c9a227" strokeWidth="2" fill="none"/>
      <rect x="4" y="10" width="40" height="28" rx="2" fill="none" stroke="#c9a227" strokeWidth="1"/>
    </svg>
  ),
  about: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <circle cx="24" cy="24" r="20" fill="#4a90d9"/>
      <circle cx="24" cy="16" r="6" fill="#fff"/>
      <path d="M12 38 Q12 28 24 28 Q36 28 36 38" fill="#fff"/>
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <rect x="6" y="6" width="36" height="36" rx="4" fill="#6c5ce7"/>
      <rect x="10" y="28" width="6" height="10" fill="#a29bfe"/>
      <rect x="18" y="22" width="6" height="16" fill="#a29bfe"/>
      <rect x="26" y="16" width="6" height="22" fill="#a29bfe"/>
      <rect x="34" y="10" width="6" height="28" fill="#a29bfe"/>
    </svg>
  ),
  experience: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <rect x="8" y="14" width="32" height="24" rx="2" fill="#8b4513"/>
      <rect x="18" y="10" width="12" height="6" rx="1" fill="#a0522d"/>
      <rect x="20" y="22" width="8" height="6" rx="1" fill="#daa520"/>
    </svg>
  ),
  paint: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <ellipse cx="20" cy="28" rx="16" ry="14" fill="#f5f5dc" stroke="#666" strokeWidth="1"/>
      <circle cx="12" cy="22" r="4" fill="#ff0000"/>
      <circle cx="22" cy="18" r="4" fill="#ffff00"/>
      <circle cx="28" cy="26" r="4" fill="#00ff00"/>
      <circle cx="18" cy="34" r="4" fill="#0000ff"/>
      <rect x="32" y="8" width="4" height="24" rx="1" fill="#8b4513" transform="rotate(30 34 20)"/>
      <ellipse cx="39" cy="6" rx="3" ry="5" fill="#333" transform="rotate(30 39 6)"/>
    </svg>
  ),
  explorer: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <path d="M4 12 L4 40 L44 40 L44 16 L22 16 L18 12 Z" fill="#ffd93d" stroke="#e6b800" strokeWidth="1"/>
      <path d="M4 18 L44 18 L44 40 L4 40 Z" fill="#ffe066"/>
    </svg>
  ),
  photos: (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-md">
      <rect x="6" y="10" width="36" height="28" rx="2" fill="#fff" stroke="#666" strokeWidth="1"/>
      <rect x="10" y="14" width="28" height="20" fill="#87ceeb"/>
      <circle cx="18" cy="22" r="4" fill="#ffd700"/>
      <path d="M10 34 L18 26 L26 32 L32 24 L38 34 Z" fill="#228b22"/>
    </svg>
  ),
};

interface DesktopProps {
  onOpenWindow: (id: WindowId) => void;
  onIconClick: () => void;
  onToggleTheme?: () => void;
}

const desktopIcons: { id: WindowId; title: string; icon: React.ReactNode }[] = [
  { id: 'about', title: 'About Me', icon: XPIcons.about },
  { id: 'skills', title: 'My Skills', icon: XPIcons.skills },
  { id: 'projects', title: 'Projects', icon: XPIcons.projects },
  { id: 'experience', title: 'Experience', icon: XPIcons.experience },
  { id: 'contact', title: 'Contact Me', icon: XPIcons.contact },
  { id: 'cv', title: 'Resume', icon: XPIcons.resume },
  { id: 'paint', title: 'Paint', icon: XPIcons.paint },
  { id: 'explorer', title: 'My Files', icon: XPIcons.explorer },
  { id: 'photos', title: 'Pictures', icon: XPIcons.photos },
];

export function Desktop({ onOpenWindow, onIconClick, onToggleTheme }: DesktopProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const isMobile = useIsMobile();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRefresh = () => {
    setShowWelcome(false);
    setTimeout(() => setShowWelcome(true), 100);
  };

  return (
    <div 
      className="absolute inset-0 p-4 pb-16 overflow-hidden"
      style={{
        backgroundImage: `url(${xpWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {/* Desktop Icons Grid - XP style layout */}
      <div className="grid grid-cols-1 gap-1 w-fit">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            title={icon.title}
            icon={icon.icon}
            onClick={onIconClick}
            onDoubleClick={() => onOpenWindow(icon.id)}
          />
        ))}
      </div>

      {/* Welcome notification */}
      {showWelcome && (
        <div className="fixed top-4 right-4 bg-[#ffffcc] border border-[#c0c0c0] shadow-lg rounded p-4 max-w-sm animate-slide-up z-50"
          style={{ boxShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-[#4a90d9] to-[#1e5799] flex items-center justify-center text-white font-bold text-sm shrink-0">
              KJM
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-sm text-gray-800">Welcome!</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcome(false);
                  }}
                  className="text-gray-600 hover:text-gray-800 transition-colors text-lg leading-none font-bold"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-gray-700 mt-1">
                Double-click icons to explore my portfolio. Right-click for options.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onRefresh={handleRefresh}
          onToggleTheme={onToggleTheme}
        />
      )}
    </div>
  );
}
