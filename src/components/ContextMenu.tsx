import { useEffect, useRef } from 'react';
import { RefreshCw, Monitor, Palette, Info, Layout, SortAsc, Eye, FolderPlus } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh?: () => void;
  onToggleTheme?: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
  submenu?: MenuItem[];
}

export function ContextMenu({ x, y, onClose, onRefresh, onToggleTheme }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust position to keep menu on screen
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 350);

  const menuItems: MenuItem[] = [
    {
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      submenu: [
        { label: 'Large icons', icon: <Layout className="w-4 h-4" /> },
        { label: 'Medium icons', icon: <Layout className="w-4 h-4" /> },
        { label: 'Small icons', icon: <Layout className="w-4 h-4" /> },
      ]
    },
    {
      label: 'Sort by',
      icon: <SortAsc className="w-4 h-4" />,
      submenu: [
        { label: 'Name', icon: <SortAsc className="w-4 h-4" /> },
        { label: 'Size', icon: <SortAsc className="w-4 h-4" /> },
        { label: 'Date modified', icon: <SortAsc className="w-4 h-4" /> },
      ]
    },
    { label: '', icon: null, divider: true },
    {
      label: 'Refresh',
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: () => {
        onRefresh?.();
        onClose();
      }
    },
    { label: '', icon: null, divider: true },
    {
      label: 'New',
      icon: <FolderPlus className="w-4 h-4" />,
      submenu: [
        { label: 'Folder', icon: <FolderPlus className="w-4 h-4" /> },
        { label: 'Shortcut', icon: <FolderPlus className="w-4 h-4" /> },
      ]
    },
    { label: '', icon: null, divider: true },
    {
      label: 'Display settings',
      icon: <Monitor className="w-4 h-4" />,
      onClick: onClose
    },
    {
      label: 'Personalize',
      icon: <Palette className="w-4 h-4" />,
      onClick: () => {
        onToggleTheme?.();
        onClose();
      }
    },
    { label: '', icon: null, divider: true },
    {
      label: 'About this portfolio',
      icon: <Info className="w-4 h-4" />,
      onClick: onClose
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[10000] w-56 glass-panel-strong rounded-lg py-1.5 animate-scale-in shadow-2xl"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {menuItems.map((item, index) => (
        item.divider ? (
          <div key={index} className="h-px bg-border/50 my-1.5 mx-3" />
        ) : (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full px-3 py-2 flex items-center gap-3 text-sm text-foreground hover:bg-primary/10 transition-colors text-left group"
          >
            <span className="text-muted-foreground group-hover:text-primary transition-colors">
              {item.icon}
            </span>
            <span>{item.label}</span>
            {item.submenu && (
              <span className="ml-auto text-muted-foreground">›</span>
            )}
          </button>
        )
      ))}
    </div>
  );
}
