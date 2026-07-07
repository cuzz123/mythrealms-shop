"use client";

import { useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  SelectionMode,
  Panel,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MediaNode, type MediaNodeType, type MediaNodeData } from "./MediaNode";
import { GeneratorPanel } from "./GeneratorPanel";
import { useStudioStore } from "@/store/studio-store";
import { Sparkles } from "lucide-react";

const nodeTypes = { media: MediaNode };

const defaultViewport = { x: 0, y: 0, zoom: 0.8 };

function CanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<MediaNodeType>([]);
  const { addNodes, deleteElements } = useReactFlow<MediaNodeType>();
  const generatingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { setGenerating, setLastPrompt, isGenerating } = useStudioStore();

  const onNodesChangeFiltered = useCallback(
    (changes: NodeChange<MediaNodeType>[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Listen for delete-node events from MediaNode
  const handleWrapperRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      wrapperRef.current = el;
      el.addEventListener("delete-node", ((e: CustomEvent) => {
        deleteElements({ nodes: [{ id: e.detail }] });
      }) as EventListener);
    }
  }, [deleteElements]);

  const handleGenerate = useCallback(
    async (prompt: string, type: "image" | "video") => {
      if (generatingRef.current) return;
      generatingRef.current = true;
      setGenerating(true);
      setLastPrompt(prompt, type);

      const nodeId = `node-${Date.now()}`;
      const nodeWidth = type === "video" ? 320 : 280;
      const nodeHeight = type === "video" ? 180 : 280;

      const newNode: MediaNodeType = {
        id: nodeId,
        type: "media",
        position: {
          x: 200 + Math.random() * 400,
          y: 100 + Math.random() * 300,
        },
        data: {
          type,
          src: "",
          prompt,
          status: "generating",
          width: nodeWidth,
          height: nodeHeight,
          createdAt: Date.now(),
        },
      };

      addNodes(newNode);

      try {
        const endpoint = type === "image" ? "/api/studio/image" : "/api/studio/video";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const json = await res.json();

        const src = type === "image" ? json.imageUrl : json.videoUrl;

        if (!res.ok || !src) {
          throw new Error(json.error || "No result returned");
        }

        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  data: {
                    ...(n.data as MediaNodeData),
                    src,
                    status: "done",
                  } as MediaNodeData,
                }
              : n
          )
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  data: {
                    ...(n.data as MediaNodeData),
                    status: "error",
                    error: msg,
                  } as MediaNodeData,
                }
              : n
          )
        );
      } finally {
        generatingRef.current = false;
        setGenerating(false);
      }
    },
    [addNodes, setNodes, setGenerating, setLastPrompt]
  );

  return (
    <div ref={handleWrapperRef} id="react-flow-wrapper" className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChangeFiltered}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        minZoom={0.05}
        maxZoom={5}
        fitView={false}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        selectNodesOnDrag={false}
        selectionMode={SelectionMode.Partial}
        deleteKeyCode={["Delete", "Backspace"]}
        className="bg-[#0A0A0B]"
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.04)"
        />
        <Controls
          className="[&>button]:!bg-[var(--surface)] [&>button]:!border-[var(--border)] [&>button]:!text-[var(--text-secondary)] [&>button]:hover:!bg-[var(--surface-raised)] [&>button]:hover:!text-white [&>svg]:!fill-[var(--text-secondary)]"
          position="bottom-right"
          showInteractive={false}
        />

        {/* Logo / heading panel */}
        <Panel position="top-left" className="ml-4 mt-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="font-serif text-sm font-semibold text-[var(--text)] leading-none">MythRealms Studio</h1>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Infinite Canvas · AI Image & Video</p>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      <GeneratorPanel
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}

export function InfiniteCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
