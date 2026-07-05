"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ImageIcon,
  Video,
  Send,
  Loader2,
  Settings2,
  X,
} from "lucide-react";

interface Props {
  onGenerate: (prompt: string, type: "image" | "video") => void;
  isGenerating: boolean;
}

export function GeneratorPanel({ onGenerate, isGenerating }: Props) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"image" | "video">("image");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [prompt]);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim(), mode);
    setPrompt("");
  }, [prompt, mode, isGenerating, onGenerate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        setPrompt("");
        inputRef.current?.blur();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[660px] px-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl">
        {/* Mode selector */}
        <div className="flex items-center gap-1 px-3 pt-3 pb-2">
          <button
            onClick={() => setMode("image")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              mode === "image"
                ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image
          </button>
          <button
            onClick={() => setMode("video")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              mode === "video"
                ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video
          </button>
        </div>

        {/* Input area */}
        <div className="flex items-end gap-2 px-3 pb-3">
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "image"
                ? "Describe an image you want to generate..."
                : "Describe a video scene you want to create..."
            }
            rows={1}
            maxLength={2000}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] py-2 px-1 max-h-32"
            disabled={isGenerating}
          />

          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition ${
              prompt.trim() && !isGenerating
                ? "bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)]"
                : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
            }`}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
