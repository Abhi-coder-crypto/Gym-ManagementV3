import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, X } from "lucide-react";
import { useState, useEffect } from "react";

export interface DocumentViewerProps {
  open: boolean;
  document: {
    url: string;
    name: string;
    mimeType?: string;
  } | null;
  onClose: () => void;
}

export function DocumentViewer({ open, document, onClose }: DocumentViewerProps) {
  const [imageError, setImageError] = useState(false);

  // Reset image error state whenever document changes
  useEffect(() => {
    setImageError(false);
  }, [document?.url]);

  if (!document) return null;

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.click();
  };

  const getMimeType = (): string => {
    if (document.mimeType) return document.mimeType;
    
    const extension = document.url.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
  };

  const mimeType = getMimeType();
  const isImage = mimeType.startsWith('image/');
  const isPDF = mimeType === 'application/pdf';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.name}
          </DialogTitle>
          <DialogDescription>
            Document viewer
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex-1 overflow-auto px-6 pb-6">
          {isImage && !imageError ? (
            <div className="flex items-center justify-center bg-muted/50 rounded-md p-4">
              <img
                src={document.url}
                alt={document.name}
                className="max-w-full max-h-[60vh] object-contain rounded-md"
                onError={() => setImageError(true)}
                data-testid="img-document-preview"
              />
            </div>
          ) : isPDF ? (
            <div className="w-full" style={{ height: '70vh' }}>
              <iframe
                src={document.url}
                className="w-full h-full border rounded-md"
                title={document.name}
                data-testid="iframe-pdf-preview"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Cannot preview this file type</p>
              <p className="text-sm text-muted-foreground mb-4">
                This file type cannot be previewed in the browser. Please download it to view.
              </p>
              <Button onClick={handleDownload} data-testid="button-download-fallback">
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 px-6 pb-6 pt-2 border-t">
          <Button
            variant="outline"
            onClick={handleDownload}
            data-testid="button-download-document"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="button-close-viewer"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
