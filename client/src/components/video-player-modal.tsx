import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
}

export function VideoPlayerModal({ 
  isOpen, 
  onClose, 
  videoUrl, 
  videoTitle 
}: VideoPlayerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0 overflow-hidden" data-testid="dialog-video-player">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-background">
          <DialogTitle className="text-lg font-semibold">{videoTitle}</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover-elevate"
            data-testid="button-close-video-player"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        
        <div className="w-full bg-black flex items-center justify-center relative">
          <video
            key={videoUrl}
            controls
            autoPlay
            className="w-full h-auto max-h-[calc(90vh-80px)] object-contain"
            data-testid="video-element"
            controlsList="nodownload"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
