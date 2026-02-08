import { useState, useCallback } from 'react';
import { BootScreen } from '@/components/BootScreen';
import { LoginScreen } from '@/components/LoginScreen';
import { Desktop } from '@/components/Desktop';
import { Taskbar } from '@/components/Taskbar';
import { Window } from '@/components/Window';
import { AboutWindow } from '@/components/windows/AboutWindow';
import { SkillsWindow } from '@/components/windows/SkillsWindow';
import { ProjectsWindow } from '@/components/windows/ProjectsWindow';
import { ExperienceWindow } from '@/components/windows/ExperienceWindow';
import { ContactWindow } from '@/components/windows/ContactWindow';
import { CVWindow } from '@/components/windows/CVWindow';
import { PaintApp } from '@/components/apps/PaintApp';
import { FileExplorerApp } from '@/components/apps/FileExplorerApp';
import { MediaViewerApp } from '@/components/apps/MediaViewerApp';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useSound } from '@/hooks/useSound';
import { WindowId } from '@/types/window';

const windowContents: Record<WindowId, React.ReactNode> = {
  about: <AboutWindow />,
  skills: <SkillsWindow />,
  projects: <ProjectsWindow />,
  experience: <ExperienceWindow />,
  contact: <ContactWindow />,
  cv: <CVWindow />,
  paint: <PaintApp />,
  explorer: <FileExplorerApp />,
  photos: <MediaViewerApp />,
};

type AppPhase = 'boot' | 'login' | 'desktop';

export default function Index() {
  const [phase, setPhase] = useState<AppPhase>('boot');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const { playStartupSound, playClickSound, playOpenSound, playCloseSound } = useSound();
  
  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    getTaskbarWindows,
  } = useWindowManager();

  const handleBootComplete = useCallback(() => {
    setPhase('login');
  }, []);

  const handleLogin = useCallback(() => {
    setPhase('desktop');
    // Play startup sound after login
    setTimeout(() => {
      if (!isMuted) {
        playStartupSound();
      }
    }, 300);
  }, [playStartupSound, isMuted]);

  const handleOpenWindow = useCallback((id: WindowId) => {
    if (!isMuted) playOpenSound();
    openWindow(id);
  }, [openWindow, playOpenSound, isMuted]);

  const handleCloseWindow = useCallback((id: string) => {
    if (!isMuted) playCloseSound();
    closeWindow(id);
  }, [closeWindow, playCloseSound, isMuted]);

  const handleIconClick = useCallback(() => {
    if (!isMuted) playClickSound();
  }, [playClickSound, isMuted]);

  const handleTaskbarWindowClick = useCallback((id: string) => {
    if (!isMuted) playClickSound();
    const window = windows.find(w => w.id === id);
    if (window?.isMinimized) {
      // Unminimize and focus - call openWindow which handles unminimizing
      openWindow(id as WindowId);
    } else {
      // Toggle minimize if already focused at top, otherwise focus
      const topWindow = windows.reduce((top, w) => 
        !w.isMinimized && w.zIndex > (top?.zIndex ?? 0) ? w : top, 
        null as typeof windows[0] | null
      );
      if (topWindow?.id === id) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    }
  }, [windows, openWindow, focusWindow, minimizeWindow, playClickSound, isMuted]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden select-none">
      {/* Boot Screen */}
      {phase === 'boot' && <BootScreen onComplete={handleBootComplete} />}

      {/* Login Screen */}
      {phase === 'login' && <LoginScreen onLogin={handleLogin} />}

      {/* Desktop Environment */}
      {phase === 'desktop' && (
        <>
          {/* Desktop Background & Icons */}
          <Desktop 
            onOpenWindow={handleOpenWindow}
            onIconClick={handleIconClick}
            onToggleTheme={toggleTheme}
          />

          {/* Windows */}
          {windows.map((window) => (
            <Window
              key={window.id}
              window={window}
              onClose={() => handleCloseWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onUpdatePosition={(pos) => updateWindowPosition(window.id, pos)}
            >
              {windowContents[window.id as WindowId]}
            </Window>
          ))}

          {/* Taskbar */}
          <Taskbar
            windows={getTaskbarWindows()}
            onWindowClick={handleTaskbarWindowClick}
            onOpenWindow={handleOpenWindow}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        </>
      )}
    </div>
  );
}
