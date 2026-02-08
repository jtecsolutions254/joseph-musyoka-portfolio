import { User, Code, FolderOpen, Briefcase, Mail, FileText } from 'lucide-react';
import { DesktopIcon } from './DesktopIcon';
import { WindowId } from '@/types/window';

interface DesktopProps {
  onOpenWindow: (id: WindowId) => void;
  onIconClick: () => void;
}

const desktopIcons: { id: WindowId; title: string; icon: React.ReactNode; colorClass: string }[] = [
  { id: 'about', title: 'About Me', icon: <User className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'skills', title: 'Skills', icon: <Code className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'projects', title: 'Projects', icon: <FolderOpen className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'experience', title: 'Experience', icon: <Briefcase className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'contact', title: 'Contact', icon: <Mail className="w-8 h-8" />, colorClass: 'text-primary' },
  { id: 'cv', title: 'CV / Letter', icon: <FileText className="w-8 h-8" />, colorClass: 'text-primary' },
];

export function Desktop({ onOpenWindow, onIconClick }: DesktopProps) {
  return (
    <div 
      className="absolute inset-0 p-6 pb-16 overflow-hidden bg-gradient-to-br from-[hsl(var(--desktop-bg))] via-background to-primary/10"
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
      <div className="fixed top-4 right-4 glass-panel-strong rounded-xl p-4 max-w-sm animate-slide-up z-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold shrink-0">
            KJ
          </div>
          <div>
            <h3 className="font-semibold text-sm">Welcome to my Portfolio!</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Double-click icons to explore my work, or use the Start menu below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
