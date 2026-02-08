import { useState, useEffect, useRef } from 'react';
import { FileText, Download, Upload, Eye, Trash2, Loader2, File, AlertCircle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';

interface UploadedFile {
  id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  created_at: string;
  public_url: string;
}

export function CVWindow() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, deleteFile, getFiles, isUploading, uploadProgress, error, clearError } = useFileUpload({
    fileType: 'cv',
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    const cvFiles = await getFiles('cv');
    setFiles(cvFiles);
    if (cvFiles.length > 0 && !selectedFile) {
      setSelectedFile(cvFiles[0]);
    }
    setIsLoading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, 'Resume / CV');
    if (result) {
      await loadFiles();
      setSelectedFile(result);
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    if (confirm(`Delete "${file.file_name}"?`)) {
      const success = await deleteFile(file.file_path, file.id);
      if (success) {
        await loadFiles();
        if (selectedFile?.id === file.id) {
          setSelectedFile(files[0] || null);
        }
      }
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-destructive to-destructive/60 flex items-center justify-center">
            <FileText className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Resume / CV</h1>
            <p className="text-sm text-muted-foreground">Upload and manage your documents</p>
          </div>
        </div>
        
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload CV
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
          <button onClick={clearError} className="ml-auto text-sm underline">Dismiss</button>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* File list */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Documents</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No documents uploaded yet</p>
              <p className="text-xs mt-1">Click "Upload CV" to add your resume</p>
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedFile?.id === file.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-8 h-8 text-destructive shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <a
                    href={file.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-secondary rounded hover:bg-secondary/80 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </a>
                  <a
                    href={file.public_url}
                    download={file.file_name}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file);
                    }}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Preview</h3>
          
          {selectedFile ? (
            <div className="border rounded-lg overflow-hidden bg-card" style={{ height: '500px' }}>
              {selectedFile.mime_type === 'application/pdf' ? (
                <iframe
                  src={selectedFile.public_url}
                  className="w-full h-full"
                  title={selectedFile.file_name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-sm">Preview not available for this file type</p>
                  <a
                    href={selectedFile.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    <Download className="w-4 h-4" />
                    Download to view
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-lg flex items-center justify-center text-muted-foreground bg-secondary/20" style={{ height: '500px' }}>
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm">Select a document to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
