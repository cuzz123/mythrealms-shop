"use client";

import { create } from "zustand";

interface StudioStore {
  isGenerating: boolean;
  lastPrompt: string;
  lastType: "image" | "video";
  setGenerating: (v: boolean) => void;
  setLastPrompt: (p: string, t: "image" | "video") => void;
  clearCanvas: () => void;
}

export const useStudioStore = create<StudioStore>((set) => ({
  isGenerating: false,
  lastPrompt: "",
  lastType: "image",
  setGenerating: (v) => set({ isGenerating: v }),
  setLastPrompt: (p, t) => set({ lastPrompt: p, lastType: t }),
  clearCanvas: () => set({ isGenerating: false, lastPrompt: "", lastType: "image" }),
}));
