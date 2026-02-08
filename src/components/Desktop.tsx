import { useState } from 'react';
import { User, Code, FolderOpen, Briefcase, Mail, FileText, Palette, Image, Folder } from 'lucide-react';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { WindowId } from '@/types/window';

interface DesktopProps {
  onOpenWindow: (id: WindowId) => void;
  onIconClick: () => void;
  onToggleTheme?: () => void;
}

const desktopIcons: { id: WindowId; title: string; icon: React.ReactNode; colorClass: string }[] = [
  { id: 'about', title: 'About Me', icon: <User className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'skills', title: 'Skills', icon: <Code className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'projects', title: 'Projects', icon: <FolderOpen className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'experience', title: 'Experience', icon: <Briefcase className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'contact', title: 'Contact', icon: <Mail className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'cv', title: 'CV / Letter', icon: <FileText className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'paint', title: 'Paint', icon: <Palette className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'explorer', title: 'Files', icon: <Folder className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'photos', title: 'Photos', icon: <Image className="w-8 h-8" />, colorClass: 'text-primary' },
];

export function Desktop({ onOpenWindow, onIconClick, onToggleTheme }: DesktopProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRefresh = () => {
    // Simulate refresh animation
    setShowWelcome(false);
    setTimeout(() => setShowWelcome(true), 100);
  };

  return (
    <div 
      className="absolute inset-0 p-6 pb-16 overflow-hidden bg-gradient-to-br from-[hsl(var(--desktop-bg))] via-background to-primary/10"
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {/* Desktop Icons Grid */}
      <div className="grid grid-cols-1 gap-2 w-fit">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            title={icon.title}
            icon={<div className={icon.colorClass}>{icon.icon}</div>}
            onClick={onIconClick}
            onDoubleClick={() => onOpenWindow(icon.id)}
          />
        ))}
      </div>

      {/* Welcome notification - appears after boot */}
      {showWelcome && (
        <div className="fixed top-4 right-4 glass-panel-strong rounded-xl p-4 max-w-sm animate-slide-up z-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold shrink-0">
              KJ
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm">Welcome to my Portfolio!</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcome(false);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Double-click icons to explore, or right-click for options.
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
