"use client"

import { useState, useId, useRef, type ReactNode, type KeyboardEvent } from "react"
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
  const idPrefix = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null

    switch (e.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % tabs.length
        break
      case "ArrowLeft":
        nextIndex = (index - 1 + tabs.length) % tabs.length
        break
      case "Home":
        nextIndex = 0
        break
      case "End":
        nextIndex = tabs.length - 1
        break
      default:
        return
    }

    e.preventDefault()
    setActiveIndex(nextIndex)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex border-b border-[var(--border)]" role="tablist" aria-orientation="horizontal">
        {tabs.map((tab, index) => {
          const tabId = `${idPrefix}-tab-${index}`
          const panelId = `${idPrefix}-panel-${index}`
          const selected = index === activeIndex

          return (
            <button
              key={index}
              ref={(el) => { tabRefs.current[index] = el }}
              id={tabId}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors duration-150 cursor-pointer",
                selected
                  ? "text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {tab.label}
              {selected && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
              )}
            </button>
          )
        })}
      </div>

      {tabs.map((tab, index) => {
        const tabId = `${idPrefix}-tab-${index}`
        const panelId = `${idPrefix}-panel-${index}`

        return (
          <div
            key={index}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={index !== activeIndex}
            className={cn("pt-4", index !== activeIndex && "hidden")}
          >
            {tab.content}
          </div>
        )
      })}
    </div>
  )
}
