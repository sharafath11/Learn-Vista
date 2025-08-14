import { Download, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./shared/components/ui/dialog";
import { Button } from "./shared/components/ui/button";

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  type?: "image" | "video" | "audio" | "pdf" | "other";
  title?: string;
}
export function MediaModal({ open, onClose, url, type, title }: MediaModalProps) {
  const getType = () => {
    if (type) return type;
    const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)) return "image";
    if (["mp4", "webm", "ogg"].includes(ext!)) return "video";
    if (["mp3", "wav", "ogg"].includes(ext!)) return "audio";
    if (ext === "pdf") return "pdf";
    return "other";
  };

  const renderContent = () => {
    switch (getType()) {
      case "image":
        return (
          <img
            src={url}
            alt={title || "media"}
            className="max-h-[80vh] mx-auto rounded-lg shadow-lg"
          />
        );
      case "video":
        return (
          <video
            src={url}
            controls
            className="max-h-[80vh] mx-auto rounded-lg shadow-lg"
          />
        );
      case "audio":
        return <audio src={url} controls className="w-full" />;
      case "pdf":
        return (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
            className="w-full h-[80vh] rounded-lg shadow-lg"
          />
        );
      default:
        return (
          <div className="text-center">
            <p className="mb-4">Preview not available</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-4">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{title || "Preview"}</DialogTitle>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="mt-4">{renderContent()}</div>

        {/* Show download button only for PDFs */}
        {getType() === "pdf" && (
          <div className="mt-4 text-right">
            <Button
              variant="outline"
              onClick={() => window.open(url, "_blank")}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
