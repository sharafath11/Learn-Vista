import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/shared/components/ui/dialog";
import { IVideoPreviewModalProps } from "../types/sharedProps";



export default function VideoPreviewModal({
  open,
  onClose,
  videoUrl,
}: IVideoPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] aspect-video p-0 overflow-hidden bg-gray-900">
        <DialogHeader>
          <DialogTitle className="sr-only">Video Preview</DialogTitle>
        </DialogHeader>
        {videoUrl && (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain bg-black"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </DialogContent>
    </Dialog>
  );
}
