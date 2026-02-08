import { useState } from 'react';
import { Folder, FileText, Image, Code, ChevronRight, ChevronDown, Home, ArrowLeft, ArrowRight, Search, Grid, List } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  icon?: React.ReactNode;
  children?: FileItem[];
  size?: string;
  modified?: string;
}

const fileStructure: FileItem[] = [
  {
    name: 'Projects',
    type: 'folder',
    children: [
      { name: 'Student Management System', type: 'folder', children: [
        { name: 'README.md', type: 'file', size: '2.4 KB', modified: 'Dec 15, 2024' },
        { name: 'src', type: 'folder', children: [] },
        { name: 'package.json', type: 'file', size: '1.2 KB', modified: 'Dec 10, 2024' },
      ]},
      { name: 'E-Commerce Platform', type: 'folder', children: [] },
      { name: 'Weather App', type: 'folder', children: [] },
      { name: 'Portfolio Website', type: 'folder', children: [] },
    ]
  },
  {
    name: 'Documents',
    type: 'folder',
    children: [
      { name: 'Resume.pdf', type: 'file', icon: <FileText className="w-4 h-4 text-red-500" />, size: '156 KB', modified: 'Jan 5, 2025' },
      { name: 'Cover Letter.docx', type: 'file', icon: <FileText className="w-4 h-4 text-blue-500" />, size: '45 KB', modified: 'Jan 3, 2025' },
      { name: 'Certificates', type: 'folder', children: [] },
    ]
  },
  {
    name: 'Skills',
    type: 'folder',
    children: [
      { name: 'frontend.md', type: 'file', size: '3.1 KB', modified: 'Dec 20, 2024' },
      { name: 'backend.md', type: 'file', size: '2.8 KB', modified: 'Dec 20, 2024' },
      { name: 'devops.md', type: 'file', size: '1.5 KB', modified: 'Dec 18, 2024' },
    ]
  },
  {
    name: 'Images',
    type: 'folder',
    children: [
      { name: 'profile-photo.jpg', type: 'file', icon: <Image className="w-4 h-4 text-green-500" />, size: '2.1 MB', modified: 'Nov 10, 2024' },
      { name: 'project-screenshots', type: 'folder', children: [] },
    ]
  },
];

export function FileExplorerApp() {
  const [currentPath, setCurrentPath] = useState<string[]>(['Home']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Projects', 'Documents']));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const toggleFolder = (name: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const getFileIcon = (item: FileItem) => {
    if (item.icon) return item.icon;
    if (item.type === 'folder') {
      return <Folder className="w-4 h-4 text-yellow-500" />;
    }
    if (item.name.endsWith('.md') || item.name.endsWith('.txt')) {
      return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
    if (item.name.endsWith('.js') || item.name.endsWith('.ts') || item.name.endsWith('.json')) {
      return <Code className="w-4 h-4 text-yellow-600" />;
    }
    return <FileText className="w-4 h-4 text-muted-foreground" />;
  };

  const renderTreeItem = (item: FileItem, depth: number = 0) => {
    const isExpanded = expandedFolders.has(item.name);
    const isSelected = selectedItem === item.name;

    return (
      <div key={item.name}>
        <button
          onClick={() => {
            setSelectedItem(item.name);
            if (item.type === 'folder') {
              toggleFolder(item.name);
            }
          }}
          className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors ${
            isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-secondary'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {item.type === 'folder' && (
            <span className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </span>
          )}
          {item.type === 'file' && <span className="w-4" />}
          {getFileIcon(item)}
          <span className="truncate">{item.name}</span>
        </button>
        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderGridItem = (item: FileItem) => (
    <button
      key={item.name}
      onClick={() => setSelectedItem(item.name)}
      onDoubleClick={() => {
        if (item.type === 'folder') {
          toggleFolder(item.name);
        }
      }}
      className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
        selectedItem === item.name ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-secondary'
      }`}
    >
      {item.type === 'folder' ? (
        <Folder className="w-12 h-12 text-yellow-500" />
      ) : (
        <FileText className="w-12 h-12 text-muted-foreground" />
      )}
      <span className="text-sm text-center truncate w-full">{item.name}</span>
    </button>
  );

  const renderListItem = (item: FileItem) => (
    <button
      key={item.name}
      onClick={() => setSelectedItem(item.name)}
      onDoubleClick={() => {
        if (item.type === 'folder') {
          toggleFolder(item.name);
        }
      }}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
        selectedItem === item.name ? 'bg-primary/20' : 'hover:bg-secondary'
      }`}
    >
      {getFileIcon(item)}
      <span className="flex-1 text-left truncate">{item.name}</span>
      <span className="text-muted-foreground w-20 text-right">{item.size || '--'}</span>
      <span className="text-muted-foreground w-32 text-right">{item.modified || '--'}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-secondary/50 border-b border-border">
        <button className="p-2 rounded hover:bg-secondary transition-colors" title="Back">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="p-2 rounded hover:bg-secondary transition-colors" title="Forward">
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="p-2 rounded hover:bg-secondary transition-colors" title="Home">
          <Home className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <div className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-background rounded border border-border">
          {currentPath.map((segment, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <span className="text-sm">{segment}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-3 py-1.5 text-sm bg-background rounded border border-border w-48 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* View toggle */}
        <div className="flex border border-border rounded overflow-hidden">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Quick access */}
        <div className="w-48 border-r border-border p-2 overflow-auto bg-secondary/20">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Quick access</div>
          {fileStructure.map(item => renderTreeItem(item))}
        </div>

        {/* Files view */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {fileStructure.map(item => renderGridItem(item))}
            </div>
          ) : (
            <div className="space-y-0">
              {/* Header */}
              <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <span className="flex-1">Name</span>
                <span className="w-20 text-right">Size</span>
                <span className="w-32 text-right">Date modified</span>
              </div>
              {fileStructure.map(item => renderListItem(item))}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="h-6 px-3 bg-secondary/50 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <span>{fileStructure.length} items</span>
        {selectedItem && <span>Selected: {selectedItem}</span>}
      </div>
    </div>
  );
}
