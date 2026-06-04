"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface Tab {
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultActive?: number
  className?: string
}

export function Tabs({ tabs, defaultActive = 0, className }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActive)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex border-b border-[var(--border)]" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors duration-150 cursor-pointer",
              index === activeIndex
                ? "text-[var(--text)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {tab.label}
            {index === activeIndex && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
            )}
          </button>
        ))}
      </div>

      <div className="pt-4" role="tabpanel">
        {tabs[activeIndex].content}
      </div>
    </div>
  )
}
