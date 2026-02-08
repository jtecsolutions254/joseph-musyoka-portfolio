import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { StartMenu } from './StartMenu';
import { SystemTray } from './SystemTray';
import { WindowState, WindowId } from '@/types/window';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskbarProps {
  windows: WindowState[];
  onWindowClick: (id: string) => void;
  onOpenWindow: (id: WindowId) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

// All searchable apps for the search feature
const allApps: { id: WindowId; title: string; keywords: string[] }[] = [
  { id: 'about', title: 'About Me', keywords: ['about', 'me', 'profile', 'bio'] },
  { id: 'skills', title: 'Skills', keywords: ['skills', 'abilities', 'tech', 'programming'] },
  { id: 'projects', title: 'Projects', keywords: ['projects', 'work', 'portfolio', 'demos'] },
  { id: 'experience', title: 'Experience', keywords: ['experience', 'work', 'jobs', 'career', 'history'] },
  { id: 'contact', title: 'Contact', keywords: ['contact', 'email', 'message', 'reach'] },
  { id: 'cv', title: 'Resume', keywords: ['cv', 'resume', 'curriculum', 'vitae', 'pdf'] },
  { id: 'paint', title: 'Paint', keywords: ['paint', 'draw', 'art', 'creative'] },
  { id: 'explorer', title: 'File Explorer', keywords: ['files', 'explorer', 'documents', 'folder'] },
  { id: 'photos', title: 'Photos', keywords: ['photos', 'pictures', 'images', 'gallery'] },
];

export function Taskbar({ 
  windows, 
  onWindowClick, 
  onOpenWindow, 
  isDarkMode, 
  onToggleTheme,
  isMuted,
  onToggleMute 
}: TaskbarProps) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Filter apps based on search query
  const searchResults = searchQuery.trim() 
    ? allApps.filter(app => 
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.keywords.some(kw => kw.includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearchSelect = (id: WindowId) => {
    onOpenWindow(id);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Start Menu */}
      <StartMenu
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        onOpenWindow={(id) => {
          onOpenWindow(id);
          setIsStartOpen(false);
        }}
      />

      {/* XP-style Taskbar - taller on mobile for better touch targets */}
      <div 
        className={`fixed bottom-0 left-0 right-0 ${isMobile ? 'h-[40px]' : 'h-[30px]'} flex items-center justify-between z-[500]`}
        style={{
          background: 'linear-gradient(to bottom, #3168d5 0%, #4993e6 3%, #2157d7 6%, #2663e0 10%, #1941a5 90%, #1941a5 100%)',
          borderTop: '1px solid #0c59b9',
        }}
      >
        {/* Left section - Start button */}
        <div className="flex items-center">
          {/* XP Start Button - larger on mobile */}
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={`${isMobile ? 'h-[40px] px-2' : 'h-[30px] px-3'} flex items-center gap-2 transition-all duration-100 rounded-r-xl ${
              isStartOpen 
                ? 'bg-[#2a5298]' 
                : 'hover:brightness-110'
            }`}
            style={{
              background: isStartOpen 
                ? 'linear-gradient(to bottom, #2a5298 0%, #1e4287 100%)'
                : 'linear-gradient(to bottom, #3c8f3c 0%, #47a447 10%, #3c8f3c 50%, #2d7b2d 51%, #2d7b2d 100%)',
              borderRadius: '0 8px 8px 0',
              textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
            }}
            title="Start"
          >
            {/* Windows XP Logo mini */}
            <svg width="18" height="18" viewBox="0 0 100 100" className="drop-shadow">
              <path d="M5 10 L45 15 L45 45 L5 45 Z" fill="#F25022" />
              <path d="M50 15 L95 10 L95 45 L50 45 Z" fill="#7FBA00" />
              <path d="M5 50 L45 50 L45 85 L5 90 Z" fill="#00A4EF" />
              <path d="M50 50 L95 50 L95 90 L50 85 Z" fill="#FFB900" />
            </svg>
            <span className="text-white font-bold text-sm italic">start</span>
          </button>

          {/* Quick Launch separator - hide on mobile */}
          {!isMobile && <div className="w-px h-5 bg-[#1a4ca8] mx-2" />}

          {/* Search - XP style - hidden on mobile */}
          {!isMobile && (
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`h-6 px-2 flex items-center gap-1 rounded transition-colors mx-1 ${
                  isSearchOpen ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Search className="w-3 h-3 text-white/80" />
                <span className="text-xs text-white/80 hidden sm:inline">Search</span>
              </button>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div 
                  className="absolute bottom-full left-0 mb-1 w-[280px] rounded-lg shadow-xl overflow-hidden z-[800]"
                  style={{
                    background: 'linear-gradient(180deg, #ece9d8 0%, #d4d0c8 100%)',
                    border: '2px solid #0054e3',
                  }}
                >
                  {/* Search Header */}
                  <div 
                    className="px-3 py-2 flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(180deg, #0a5dcc 0%, #0347a7 50%, #003d8c 100%)',
                    }}
                  >
                    <Search className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">Search</span>
                    <button 
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="ml-auto p-1 hover:bg-white/20 rounded"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-300">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search apps..."
                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-400 focus:outline-none focus:border-[#316ac5]"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }
                        if (e.key === 'Enter' && searchResults.length > 0) {
                          handleSearchSelect(searchResults[0].id);
                        }
                      }}
                    />
                  </div>
                  
                  {/* Search Results */}
                  <div className="max-h-[200px] overflow-y-auto">
                    {searchQuery.trim() === '' ? (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Type to search apps...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        No apps found
                      </div>
                    ) : (
                      searchResults.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => handleSearchSelect(app.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#316ac5] hover:text-white transition-colors text-gray-800"
                        >
                          <span className="text-lg">
                            {app.id === 'about' && '👤'}
                            {app.id === 'skills' && '⚡'}
                            {app.id === 'projects' && '📁'}
                            {app.id === 'experience' && '💼'}
                            {app.id === 'contact' && '📧'}
                            {app.id === 'cv' && '📄'}
                            {app.id === 'paint' && '🎨'}
                            {app.id === 'explorer' && '📂'}
                            {app.id === 'photos' && '🖼️'}
                          </span>
                          <span className="text-sm">{app.title}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center section - Running apps - scrollable on mobile */}
        <div className={`flex-1 flex items-center gap-0.5 px-1 md:px-2 overflow-x-auto ${isMobile ? 'max-w-[50vw]' : ''}`}>
          {windows.map((window) => (
            <button
              key={window.id}
              onClick={() => onWindowClick(window.id)}
              className={`${isMobile ? 'h-[32px] min-w-[80px] max-w-[100px]' : 'h-[24px] min-w-[120px] max-w-[160px]'} px-2 flex items-center gap-1.5 transition-all duration-100 text-left shrink-0`}
              style={{
                background: !window.isMinimized
                  ? 'linear-gradient(to bottom, #3a82f7 0%, #2d6ddb 50%, #2c60c5 51%, #2455b5 100%)'
                  : 'linear-gradient(to bottom, #3c7fe7 0%, #245dcc 50%, #1a4aa8 51%, #1a4aa8 100%)',
                border: '1px solid rgba(0,0,0,0.3)',
                borderRadius: '3px',
                boxShadow: !window.isMinimized 
                  ? 'inset 0 1px 0 rgba(255,255,255,0.3)' 
                  : 'none',
              }}
              title={window.title}
            >
              <span className="text-sm">{window.icon}</span>
              <span className="text-[11px] text-white truncate font-normal">
                {window.title}
              </span>
            </button>
          ))}
        </div>

        {/* Right section - System tray */}
        <SystemTray 
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
        />
      </div>
    </>
  );
}
