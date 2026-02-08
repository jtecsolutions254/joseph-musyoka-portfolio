import { useState } from 'react';
import { Search, Power, User, Settings, FileText, Briefcase, Code, Mail } from 'lucide-react';
import { WindowId } from '@/types/window';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
}

const pinnedApps: { id: WindowId; title: string; icon: React.ReactNode }[] = [
  { id: 'about', title: 'About Me', icon: <User className="w-6 h-6" /> },
  { id: 'skills', title: 'Skills', icon: <Code className="w-6 h-6" /> },
  { id: 'projects', title: 'Projects', icon: <Briefcase className="w-6 h-6" /> },
  { id: 'experience', title: 'Experience', icon: <FileText className="w-6 h-6" /> },
  { id: 'contact', title: 'Contact', icon: <Mail className="w-6 h-6" /> },
  { id: 'cv', title: 'CV', icon: <FileText className="w-6 h-6" /> },
];

export function StartMenu({ isOpen, onClose, onOpenWindow }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredApps = pinnedApps.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (id: WindowId) => {
    onOpenWindow(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999]"
        onClick={onClose}
      />

      {/* Start Menu */}
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[600px] max-w-[calc(100vw-32px)] glass-panel-strong rounded-xl overflow-hidden z-[1000] animate-slide-up">
        {/* Search Bar */}
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search portfolio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-secondary/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-4 flex items-center gap-4 border-b border-border/30">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl text-primary-foreground font-semibold">
            KJ
          </div>
          <div>
            <h3 className="font-semibold text-lg">Kiseko Joseph Musyoka</h3>
            <p className="text-sm text-muted-foreground">Computer Science Student</p>
            <p className="text-xs text-muted-foreground">University of Embu</p>
          </div>
        </div>

        {/* Pinned Apps */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Pinned</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-secondary/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary">
                  {app.icon}
                </div>
                <span className="text-xs font-medium text-center">{app.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border/30 flex items-center justify-between">
          <button
            onClick={() => handleAppClick('about')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm text-primary-foreground font-semibold">
              KJ
            </div>
            <span className="text-sm font-medium">Kiseko Joseph</span>
          </button>

          <button
            onClick={() => handleAppClick('contact')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/60 transition-colors"
          >
            <Power className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </>
  );
}
