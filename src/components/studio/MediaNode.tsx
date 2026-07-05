"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { ImageIcon, Video, X, Download, Loader2 } from "lucide-react";

export interface MediaNodeData {
  type: "image" | "video";
  src: string;
  prompt: string;
  status: "generating" | "done" | "error";
  error?: string;
  width: number;
  height: number;
  createdAt: number;
}

export type MediaNodeType = Node<MediaNodeData, "media">;

function MediaNodeComponent({ data, selected, id }: NodeProps<MediaNodeType>) {
  const [hovered, setHovered] = useState(false);
  const { type, src, prompt, status, error, width, height } = data;

  const isGenerating = status === "generating";
  const hasError = status === "error";
  const isDone = status === "done";

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = `mythrealms-${type}-${Date.now()}.${type === "video" ? "mp4" : "png"}`;
    a.target = "_blank";
    a.rel = "noopener";
    a.click();
  };

  const handleDelNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = document.getElementById("react-flow-wrapper");
    if (el) {
      el.dispatchEvent(new CustomEvent("delete-node", { detail: id }));
    }
  };

  return (
    <>
      {/* Invisible handle for React Flow internal tracking */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      <div
        className={`relative rounded-xl overflow-hidden border-2 transition-shadow duration-200 ${
          selected
            ? "border-[var(--accent)] shadow-[0_0_28px_rgba(212,168,75,0.35)]"
            : "border-[var(--border)] hover:border-[var(--text-muted)]"
        }`}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top-right controls */}
        {(hovered || selected) && (
          <div className="absolute top-2 right-2 z-10 flex gap-1.5">
            {isDone && (
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleDelNode}
              className="p-2 rounded-lg bg-black/60 hover:bg-red-600/80 text-white/80 hover:text-white transition"
              title="Remove"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content */}
        {isGenerating ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--surface)] gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--accent)]" />
            <p className="text-xs text-[var(--text-muted)] px-4 text-center max-w-[220px] line-clamp-2">
              {prompt || "Generating..."}
            </p>
          </div>
        ) : hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--surface)] gap-2 p-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <X className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-xs text-red-400/80 text-center">{error || "Generation failed"}</p>
          </div>
        ) : type === "video" ? (
          <video
            src={src}
            className="w-full h-full object-cover"
            controls={hovered || selected}
            loop
            muted
            playsInline
          />
        ) : (
          <>
            <img src={src} alt={prompt || "Generated"} className="w-full h-full object-cover" draggable={false} />
            {(hovered || selected) && prompt && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
                <p className="text-xs text-white/80 line-clamp-2">{prompt}</p>
              </div>
            )}
          </>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] text-white/50 flex items-center gap-1">
          {type === "video" ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
          {type === "video" ? "Video" : "Image"}
        </div>
      </div>
    </>
  );
}

export const MediaNode = memo(MediaNodeComponent);
