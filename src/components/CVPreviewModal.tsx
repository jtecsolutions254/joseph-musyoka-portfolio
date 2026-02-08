import { X, Download, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface CVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    file_name: string;
    public_url: string;
    mime_type: string | null;
  } | null;
}

export function CVPreviewModal({ isOpen, onClose, file }: CVPreviewModalProps) {
  const isMobile = useIsMobile();

  if (!file) return null;

  const isPdf = file.mime_type === 'application/pdf';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #ece9d8 0%, #d4d0c8 100%)',
          border: '2px solid #0054e3',
          borderRadius: '8px',
        }}
      >
        {/* XP-style Title Bar */}
        <div
          className="h-[30px] flex items-center justify-between px-3 shrink-0"
          style={{
            background: 'linear-gradient(180deg, #0a5dcc 0%, #0347a7 8%, #0453bf 40%, #0861d4 88%, #0553bf 93%, #003d8c 95%, #002d6a 100%)',
            borderRadius: '6px 6px 0 0',
          }}
        >
          <DialogHeader className="flex-row items-center gap-2 space-y-0">
            <span className="text-base">📄</span>
            <DialogTitle className="text-[13px] font-bold text-white drop-shadow-sm">
              {file.file_name} - Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-1">
            <a
              href={file.public_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-xs text-white bg-white/20 hover:bg-white/30 rounded transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              {isMobile ? '' : 'Open'}
            </a>
            <a
              href={file.public_url}
              download={file.file_name}
              className="px-2 py-1 text-xs text-white bg-white/20 hover:bg-white/30 rounded transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              {isMobile ? '' : 'Download'}
            </a>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-[#ece9d8]">
          {isPdf ? (
            <iframe
              src={`${file.public_url}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title={file.file_name}
              style={{ minHeight: '100%' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-medium mb-2">Preview not available</p>
              <p className="text-sm text-center mb-6">
                This file type cannot be previewed in the browser.
              </p>
              <div className="flex gap-2">
                <a
                  href={file.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
                <a
                  href={file.public_url}
                  download={file.file_name}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
