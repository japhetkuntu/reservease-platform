import { useRef, useState } from "react";
import { ImagePlus, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatImageUrl } from "@/data/accommodations";

interface ImageUploaderProps {
  images: (string | File)[];
  onChange: (images: (string | File)[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = maxImages - images.length;
    const toAdd = Array.from(files).slice(0, remaining);

    const newFiles = toAdd.filter(file => file.type.startsWith("image/"));

    if (newFiles.length > 0) {
      onChange([...images, ...newFiles]);
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function setFeatured(index: number) {
    // Move selected image to front
    const img = images[index];
    if (!img) return;
    onChange([img, ...images.filter((_, i) => i !== index)]);
  }

  const getUrl = (img: string | File) => {
    if (typeof img === 'string') return img;
    return URL.createObjectURL(img);
  };

  const getName = (img: string | File) => {
    if (typeof img === 'string') return img.split('/').pop() || 'image';
    return img.name;
  };

  return (
    <div className="space-y-4">
      {/* ── Drop Zone ───────────────────────────────────── */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
          dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <div className={cn(
          "p-3 rounded-xl transition-colors",
          dragging ? "bg-primary/10" : "bg-muted"
        )}>
          <ImagePlus className={cn("w-8 h-8 transition-colors", dragging ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="text-center space-y-1">
          <p className="font-semibold text-sm">
            {dragging ? "Drop photos here" : "Upload property photos"}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to browse · JPEG, PNG, WEBP · {images.length}/{maxImages} uploaded
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* ── Preview Grid ────────────────────────────────── */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, index) => {
            const url = getUrl(img);
            const name = getName(img);

            return (
              <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border bg-muted">
                <img src={formatImageUrl(url)} alt={name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/20 md:bg-black/40 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-start justify-between p-2">
                  {/* Remove */}
                  <button
                    onClick={e => { e.stopPropagation(); removeImage(index); }}
                    className="w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 z-10"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* Set as cover */}
                  {index !== 0 && (
                    <button
                      onClick={e => { e.stopPropagation(); setFeatured(index); }}
                      className="w-8 h-8 bg-background text-foreground hover:bg-amber-500 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 z-10"
                      title="Set as cover photo"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Cover badge */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" /> Cover
                  </div>
                )}
              </div>
            );
          })}

          {/* Add more slot */}
          {images.length < maxImages && (
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-muted/30 transition-all"
            >
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs font-medium">Add more</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
