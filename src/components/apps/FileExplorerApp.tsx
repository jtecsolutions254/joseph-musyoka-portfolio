import { useState, useEffect, useRef } from 'react';
import { Folder, FileText, Image, Code, ChevronRight, ChevronDown, Home, ArrowLeft, ArrowRight, Search, Grid, List, Upload, Trash2, Eye, Download, Loader2, MoreVertical } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';

interface FileItem {
  id?: string;
  name: string;
  type: 'folder' | 'file';
  icon?: React.ReactNode;
  children?: FileItem[];
  size?: string;
  modified?: string;
  isUploaded?: boolean;
  filePath?: string;
  publicUrl?: string;
}

interface ContextMenuState {
  x: number;
  y: number;
  item: FileItem | null;
}

export function FileExplorerApp() {
  const [currentPath, setCurrentPath] = useState<string[]>(['Home']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Projects', 'Documents']));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, deleteFile, getFiles, isUploading, uploadProgress } = useFileUpload({
    fileType: 'document',
  });

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    const files = await getFiles();
    const mappedFiles = files.map(f => ({
      id: f.id,
      name: f.file_name,
      type: 'file' as const,
      size: formatBytes(f.file_size || 0),
      modified: new Date(f.created_at).toLocaleDateString(),
      isUploaded: true,
      filePath: f.file_path,
      publicUrl: f.public_url,
    }));
    setUploadedFiles(mappedFiles);
    setIsLoading(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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
      name: 'Uploaded Files',
      type: 'folder',
      children: uploadedFiles,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    if (result) {
      await loadFiles();
      setExpandedFolders(prev => new Set([...prev, 'Uploaded Files']));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (item: FileItem) => {
    if (!item.isUploaded || !item.filePath || !item.id) return;
    
    if (confirm(`Delete "${item.name}"?`)) {
      const success = await deleteFile(item.filePath, item.id);
      if (success) {
        await loadFiles();
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

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
    if (item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <Image className="w-4 h-4 text-green-500" />;
    }
    if (item.name.endsWith('.pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />;
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
          onContextMenu={(e) => handleContextMenu(e, item)}
          className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors ${
            isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-secondary'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {item.type === 'folder' && (
            <span className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
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
        } else if (item.publicUrl) {
          window.open(item.publicUrl, '_blank');
        }
      }}
      onContextMenu={(e) => handleContextMenu(e, item)}
      className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
        selectedItem === item.name ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-secondary'
      }`}
    >
      {item.type === 'folder' ? (
        <Folder className="w-12 h-12 text-yellow-500" />
      ) : (
        <div className="w-12 h-12 flex items-center justify-center">
          {item.icon || <FileText className="w-10 h-10 text-muted-foreground" />}
        </div>
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
        } else if (item.publicUrl) {
          window.open(item.publicUrl, '_blank');
        }
      }}
      onContextMenu={(e) => handleContextMenu(e, item)}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
        selectedItem === item.name ? 'bg-primary/20' : 'hover:bg-secondary'
      }`}
    >
      {getFileIcon(item)}
      <span className="flex-1 text-left truncate">{item.name}</span>
      <span className="text-muted-foreground w-20 text-right">{item.size || '--'}</span>
      <span className="text-muted-foreground w-32 text-right">{item.modified || '--'}</span>
      {item.isUploaded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteFile(item);
          }}
          className="p-1 hover:bg-destructive/20 rounded text-destructive"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
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

        {/* Upload button */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="sm"
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload
            </>
          )}
        </Button>

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
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            fileStructure.map(item => renderTreeItem(item))
          )}
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
                <span className="w-8"></span>
              </div>
              {fileStructure.map(item => renderListItem(item))}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-card border border-border rounded-lg shadow-xl py-1 min-w-[160px] z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item?.publicUrl && (
            <>
              <button
                onClick={() => {
                  window.open(contextMenu.item?.publicUrl, '_blank');
                  setContextMenu(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
              >
                <Eye className="w-4 h-4" />
                Open
              </button>
              <a
                href={contextMenu.item.publicUrl}
                download={contextMenu.item.name}
                onClick={() => setContextMenu(null)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </>
          )}
          <button
            onClick={() => {
              alert(`Properties:\n\nName: ${contextMenu.item?.name}\nType: ${contextMenu.item?.type}\nSize: ${contextMenu.item?.size || 'N/A'}\nModified: ${contextMenu.item?.modified || 'N/A'}`);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
            Properties
          </button>
          {contextMenu.item?.isUploaded && (
            <>
              <div className="border-t border-border my-1" />
              <button
                onClick={() => {
                  if (contextMenu.item) handleDeleteFile(contextMenu.item);
                  setContextMenu(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* Status bar */}
      <div className="h-6 px-3 bg-secondary/50 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <span>{fileStructure.length} items</span>
        {selectedItem && <span>Selected: {selectedItem}</span>}
        {uploadedFiles.length > 0 && <span>{uploadedFiles.length} uploaded files</span>}
      </div>
    </div>
  );
}
