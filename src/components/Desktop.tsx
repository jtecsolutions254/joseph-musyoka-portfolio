import { User, Code, FolderOpen, Briefcase, Mail, FileText } from 'lucide-react';
import { DesktopIcon } from './DesktopIcon';
import { WindowId } from '@/types/window';

interface DesktopProps {
  onOpenWindow: (id: WindowId) => void;
  onIconClick: () => void;
}

const desktopIcons: { id: WindowId; title: string; icon: React.ReactNode }[] = [
  { id: 'about', title: 'About Me', icon: <User className="w-8 h-8 text-blue-500" /> },
  { id: 'skills', title: 'Skills', icon: <Code className="w-8 h-8 text-green-500" /> },
  { id: 'projects', title: 'Projects', icon: <FolderOpen className="w-8 h-8 text-yellow-500" /> },
  { id: 'experience', title: 'Experience', icon: <Briefcase className="w-8 h-8 text-purple-500" /> },
  { id: 'contact', title: 'Contact', icon: <Mail className="w-8 h-8 text-red-500" /> },
  { id: 'cv', title: 'CV / Letter', icon: <FileText className="w-8 h-8 text-cyan-500" /> },
];

export function Desktop({ onOpenWindow, onIconClick }: DesktopProps) {
  return (
    <div 
      className="absolute inset-0 p-6 pb-16 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(210 40% 96%) 0%, hsl(210 40% 88%) 50%, hsl(206 100% 85%) 100%)',
      }}
    >
      {/* Desktop Icons Grid */}
      <div className="grid grid-cols-1 gap-2 w-fit">
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
