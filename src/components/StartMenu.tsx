import { User, Code, FolderOpen, Briefcase, Mail, FileText, Power, Search, Palette, Folder, Image, LogOut, HelpCircle, Settings } from 'lucide-react';
import { WindowId } from '@/types/window';
import { Input } from './ui/input';
import { useState } from 'react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
}

const pinnedApps: { id: WindowId; title: string; icon: React.ReactNode }[] = [
  { id: 'about', title: 'About Me', icon: <User className="w-5 h-5" /> },
  { id: 'skills', title: 'My Skills', icon: <Code className="w-5 h-5" /> },
  { id: 'projects', title: 'Projects', icon: <FolderOpen className="w-5 h-5" /> },
  { id: 'experience', title: 'Experience', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'contact', title: 'Contact Me', icon: <Mail className="w-5 h-5" /> },
  { id: 'cv', title: 'Resume', icon: <FileText className="w-5 h-5" /> },
];

const systemApps: { id: WindowId; title: string; icon: React.ReactNode }[] = [
  { id: 'paint', title: 'Paint', icon: <Palette className="w-5 h-5" /> },
  { id: 'explorer', title: 'My Files', icon: <Folder className="w-5 h-5" /> },
  { id: 'photos', title: 'Pictures', icon: <Image className="w-5 h-5" /> },
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

      {/* XP-style Start Menu */}
      <div 
        className="fixed bottom-[30px] left-0 w-[380px] overflow-hidden z-[700] animate-scale-in"
        style={{
          background: 'linear-gradient(to right, #000 0px, #000 3px, #4d84d8 3px)',
          borderRadius: '0 8px 0 0',
          boxShadow: '3px -3px 12px rgba(0,0,0,0.4)',
          border: '2px solid #1e5799',
        }}
      >
        {/* User Header - XP Blue gradient */}
        <div 
          className="flex items-center gap-3 p-3"
          style={{
            background: 'linear-gradient(to bottom, #3b84df 0%, #1e5799 100%)',
          }}
        >
          <div className="w-12 h-12 rounded bg-white/20 flex items-center justify-center text-white text-lg font-bold border-2 border-white/30">
            KJM
          </div>
          <span className="text-white font-bold text-sm drop-shadow">Kiseko Joseph Musyoka</span>
        </div>

        {/* Main content area with two columns */}
        <div className="flex">
          {/* Left column - white background */}
          <div className="flex-1 bg-white">
            {/* Recent Programs / Portfolio sections */}
            <div className="p-2 border-b border-gray-200">
              {pinnedApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onOpenWindow(app.id)}
                  className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#316ac5] hover:text-white transition-colors group text-gray-800"
                >
                  <div className="w-8 h-8 flex items-center justify-center text-[#1e5799] group-hover:text-white">
                    {app.icon}
                  </div>
                  <span className="text-sm font-medium">{app.title}</span>
                </button>
              ))}
            </div>

            {/* Separator with "All Programs" */}
            <div className="px-2 py-1.5 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>All Programs</span>
                <span className="text-gray-400">▸</span>
              </div>
            </div>
          </div>

          {/* Right column - light blue background */}
          <div 
            className="w-[140px]"
            style={{
              background: 'linear-gradient(to bottom, #5a9be1 0%, #3b7dc9 100%)',
            }}
          >
            {/* System apps */}
            {systemApps.map((app) => (
              <button
                key={app.id}
                onClick={() => onOpenWindow(app.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-white/20 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {app.icon}
                </div>
                <span className="text-xs font-medium">{app.title}</span>
              </button>
            ))}

            {/* Separator */}
            <div className="my-2 mx-3 border-t border-white/20" />

            {/* System links */}
            <button className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-white/20 transition-colors">
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs font-medium">Help</span>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Bottom bar - XP style */}
        <div 
          className="flex items-center justify-end gap-2 p-2"
          style={{
            background: 'linear-gradient(to bottom, #3b84df 0%, #1a4a8f 100%)',
          }}
        >
          <button 
            onClick={() => onOpenWindow('contact')}
            className="flex items-center gap-2 px-4 py-1.5 text-white hover:bg-white/20 rounded transition-colors text-xs font-medium"
          >
            <LogOut className="w-4 h-4" />
            Contact Me
          </button>
        </div>
      </div>
    </>
  );
}
