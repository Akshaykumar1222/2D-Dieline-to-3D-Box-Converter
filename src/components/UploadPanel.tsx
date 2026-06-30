import { useRef } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpload } from "@/hooks/useUpload";

interface UploadPanelProps {
  onUpload: (url: string | null) => void;
}

export function UploadPanel({ onUpload }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { dieline, error, loading, handleFile, clear } = useUpload();

  // Drag-and-drop handlers
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file).then(() => {
        // dieline is updated async — read back via state in parent via onUpload
      });
    }
  };

  // Notify parent whenever the dieline changes.
  // (Simple effect-free wiring: call onUpload from a small effect.)
  return (
    <DielineEffect dieline={dieline?.imageUrl ?? null} onUpload={onUpload}>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-lg border-2 border-dashed border-border bg-card p-4 text-center transition-colors hover:border-primary/60"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {dieline ? (
          <div className="space-y-2">
            <img
              src={dieline.imageUrl}
              alt="Uploaded dieline preview"
              className="mx-auto max-h-48 rounded border border-border object-contain"
            />
            <p className="text-xs text-muted-foreground">
              {dieline.width}×{dieline.height}px
            </p>
            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                <ImageIcon className="mr-1 h-4 w-4" /> Replace
              </Button>
              <Button size="sm" variant="ghost" onClick={clear}>
                <X className="mr-1 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground"
          >
            <Upload className="h-8 w-8" />
            <span className="font-medium text-foreground">
              {loading ? "Loading…" : "Upload PNG dieline"}
            </span>
            <span className="text-xs">or drag &amp; drop</span>
          </button>
        )}

        {error && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </DielineEffect>
  );
}

// Tiny helper component to bridge child hook state up to parent via effect.
import { useEffect } from "react";
function DielineEffect({
  dieline,
  onUpload,
  children,
}: {
  dieline: string | null;
  onUpload: (url: string | null) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    onUpload(dieline);
  }, [dieline, onUpload]);
  return <>{children}</>;
}
