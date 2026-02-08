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
      label: 'Properties',
      icon: <Info className="w-4 h-4" />,
      onClick: onClose
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[10000] w-52 py-0.5 animate-scale-in"
      style={{ 
        left: adjustedX, 
        top: adjustedY,
        background: '#f5f5f5',
        border: '1px solid #888',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
      }}
    >
      {menuItems.map((item, index) => (
        item.divider ? (
          <div 
            key={index} 
            className="h-px mx-1 my-0.5"
            style={{ background: '#c0c0c0' }}
          />
        ) : (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full px-6 py-1 flex items-center gap-3 text-[13px] transition-colors text-left group"
            style={{ color: '#000' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#316ac5';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#000';
            }}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.submenu && (
              <span className="text-xs">▶</span>
            )}
          </button>
        )
      ))}
    </div>
  );
}
