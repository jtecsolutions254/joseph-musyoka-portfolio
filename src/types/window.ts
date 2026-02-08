export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
}

export type WindowId = 'about' | 'skills' | 'projects' | 'experience' | 'contact' | 'cv';
