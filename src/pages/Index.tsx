import { useState, useEffect, useCallback } from 'react';
import { BootScreen } from '@/components/BootScreen';
import { Desktop } from '@/components/Desktop';
import { Taskbar } from '@/components/Taskbar';
import { Window } from '@/components/Window';
import { AboutWindow } from '@/components/windows/AboutWindow';
import { SkillsWindow } from '@/components/windows/SkillsWindow';
import { ProjectsWindow } from '@/components/windows/ProjectsWindow';
import { ExperienceWindow } from '@/components/windows/ExperienceWindow';
import { ContactWindow } from '@/components/windows/ContactWindow';
import { CVWindow } from '@/components/windows/CVWindow';
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
};

export default function Index() {
  const [isBooting, setIsBooting] = useState(true);
  const [hasBooted, setHasBooted] = useState(false);
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
    setIsBooting(false);
    setHasBooted(true);
    // Play startup sound after a brief delay
    setTimeout(() => {
      playStartupSound();
    }, 200);
  }, [playStartupSound]);

  const handleOpenWindow = useCallback((id: WindowId) => {
    playOpenSound();
    openWindow(id);
  }, [openWindow, playOpenSound]);

  const handleCloseWindow = useCallback((id: string) => {
    playCloseSound();
    closeWindow(id);
  }, [closeWindow, playCloseSound]);

  const handleIconClick = useCallback(() => {
    playClickSound();
  }, [playClickSound]);

  const handleTaskbarWindowClick = useCallback((id: string) => {
    playClickSound();
    const window = windows.find(w => w.id === id);
    if (window?.isMinimized) {
      focusWindow(id);
      minimizeWindow(id); // Toggle minimized state
    } else {
      focusWindow(id);
    }
  }, [windows, focusWindow, minimizeWindow, playClickSound]);

  // Prevent context menu on desktop (more Windows-like)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Allow context menu on form inputs
      if ((e.target as HTMLElement).closest('input, textarea')) return;
      e.preventDefault();
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden select-none">
      {/* Boot Screen */}
      {isBooting && <BootScreen onComplete={handleBootComplete} />}

      {/* Desktop Environment */}
      {hasBooted && (
        <>
          {/* Desktop Background & Icons */}
          <Desktop 
            onOpenWindow={handleOpenWindow}
            onIconClick={handleIconClick}
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
          />
        </>
      )}
    </div>
  );
}
