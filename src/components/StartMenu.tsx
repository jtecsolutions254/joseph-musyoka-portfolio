import { User, Code, FolderOpen, Briefcase, Mail, FileText, Power, Search, Palette, Folder, Image } from 'lucide-react';
import { WindowId } from '@/types/window';
import { Input } from './ui/input';
import { useState } from 'react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
}

const pinnedApps: { id: WindowId; title: string; icon: React.ReactNode }[] = [
  { id: 'about', title: 'About Me', icon: <User className="w-6 h-6" /> },
  { id: 'skills', title: 'Skills', icon: <Code className="w-6 h-6" /> },
  { id: 'projects', title: 'Projects', icon: <FolderOpen className="w-6 h-6" /> },
  { id: 'experience', title: 'Experience', icon: <Briefcase className="w-6 h-6" /> },
  { id: 'contact', title: 'Contact', icon: <Mail className="w-6 h-6" /> },
  { id: 'cv', title: 'CV / Letter', icon: <FileText className="w-6 h-6" /> },
];

const systemApps: { id: WindowId; title: string; icon: React.ReactNode }[] = [
  { id: 'paint', title: 'Paint', icon: <Palette className="w-6 h-6" /> },
  { id: 'explorer', title: 'File Explorer', icon: <Folder className="w-6 h-6" /> },
  { id: 'photos', title: 'Photos', icon: <Image className="w-6 h-6" /> },
];

export function StartMenu({ isOpen, onClose, onOpenWindow }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const allApps = [...pinnedApps, ...systemApps];
  const filteredApps = searchQuery 
    ? allApps.filter(app => 
        app.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[600]" 
        onClick={onClose}
      />

      {/* Start Menu Panel */}
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[600px] max-w-[95vw] glass-panel-strong rounded-xl overflow-hidden z-[700] animate-scale-in shadow-2xl">
        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Type to search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
              autoFocus
            />
          </div>
        </div>

        {/* Search Results or Default View */}
        {filteredApps ? (
          <div className="p-4 pt-2">
            <h3 className="text-xs font-medium text-muted-foreground mb-3">Search Results</h3>
            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => onOpenWindow(app.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary">
                      {app.icon}
                    </div>
                    <span className="text-xs text-center line-clamp-2">{app.title}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No apps found</p>
            )}
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            <div className="p-4 pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Pinned</h3>
                <button className="text-xs text-primary hover:underline">All apps →</button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {pinnedApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => onOpenWindow(app.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {app.icon}
                    </div>
                    <span className="text-xs text-center line-clamp-2">{app.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Apps */}
            <div className="px-4 pb-2">
              <h3 className="text-sm font-medium mb-3">System Apps</h3>
              <div className="grid grid-cols-6 gap-2">
                {systemApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => onOpenWindow(app.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center text-foreground/80 group-hover:scale-110 transition-transform">
                      {app.icon}
                    </div>
                    <span className="text-xs text-center line-clamp-2">{app.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended / Recent */}
            <div className="p-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Recommended</h3>
                <button className="text-xs text-primary hover:underline">More →</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onOpenWindow('projects')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                    <FolderOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">My Projects</p>
                    <p className="text-xs text-muted-foreground">Recently opened</p>
                  </div>
                </button>
                <button 
                  onClick={() => onOpenWindow('cv')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">My Resume</p>
                    <p className="text-xs text-muted-foreground">Updated today</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Bottom section - User & Power */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between">
          <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-semibold">
              KJ
            </div>
            <span className="text-sm font-medium">Kiseko Joseph</span>
          </button>

          <button 
            onClick={() => onOpenWindow('contact')}
            className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Contact Me"
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
