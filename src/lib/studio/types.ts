// Types for the infinite canvas studio

export interface CanvasNode {
  id: string;
  type: "image" | "video";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  prompt: string;
  status: "generating" | "done" | "error";
  error?: string;
  createdAt: number;
}

export interface CanvasState {
  nodes: CanvasNode[];
  panX: number;
  panY: number;
  zoom: number;
  isPanning: boolean;
  selectedNodeId: string | null;
  mode: "pan" | "select";
}

export interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  seed?: number;
  model?: string;
  referenceImage?: string;
}

export interface GenerateVideoRequest {
  prompt: string;
  negativePrompt?: string;
  duration?: number;
  width?: number;
  height?: number;
  seed?: number;
  referenceImage?: string;
  fps?: number;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface GenerateVideoResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
  taskId?: string;
}
