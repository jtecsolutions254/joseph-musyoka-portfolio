import { useState, useCallback } from 'react';
import { WindowState, WindowId } from '@/types/window';

const defaultWindows: Record<WindowId, Omit<WindowState, 'zIndex' | 'isOpen' | 'isMinimized' | 'isMaximized'>> = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: '👤',
    position: { x: 100, y: 50 },
    size: { width: 600, height: 450 },
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    icon: '⚡',
    position: { x: 150, y: 80 },
    size: { width: 650, height: 500 },
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    position: { x: 200, y: 60 },
    size: { width: 750, height: 550 },
  },
  experience: {
    id: 'experience',
    title: 'Experience',
    icon: '💼',
    position: { x: 120, y: 90 },
    size: { width: 600, height: 480 },
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: '📧',
    position: { x: 180, y: 70 },
    size: { width: 500, height: 450 },
  },
  cv: {
    id: 'cv',
    title: 'CV / Attachment Letter',
    icon: '📄',
    position: { x: 140, y: 100 },
    size: { width: 550, height: 500 },
  },
};

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);

  const openWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const existingWindow = prev.find((w) => w.id === id);
      if (existingWindow) {
        // If window exists, bring to front and unminimize
        return prev.map((w) =>
          w.id === id
            ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
            : w
        );
      }
      // Create new window
      const newWindow: WindowState = {
        ...defaultWindows[id],
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: highestZIndex + 1,
      };
      return [...prev, newWindow];
    });
    setHighestZIndex((prev) => prev + 1);
  }, [highestZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w
      )
    );
    setHighestZIndex((prev) => prev + 1);
  }, [highestZIndex]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  }, []);

  const getOpenWindows = useCallback(() => {
    return windows.filter((w) => w.isOpen && !w.isMinimized);
  }, [windows]);

  const getTaskbarWindows = useCallback(() => {
    return windows.filter((w) => w.isOpen);
  }, [windows]);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    getOpenWindows,
    getTaskbarWindows,
  };
}
