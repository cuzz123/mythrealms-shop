"use client"

import { useState } from "react"
import { cn, formatPrice } from "@/lib/utils"

export interface Variant {
  id: string
  name: string
  price: number
  stock: number
  sku?: string | null
  productId?: string
}

interface VariantSelectorProps {
  variants: Variant[]
  onSelect?: (variant: Variant) => void
  onVariantChange?: (index: number) => void
  className?: string
}

export function VariantSelector({
  variants,
  onSelect,
  onVariantChange,
  className,
}: VariantSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (variant: Variant, index: number) => {
    if (variant.stock <= 0) return
    setSelectedId(variant.id)
    onSelect?.(variant)
    onVariantChange?.(index)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => {
          const isSelected = selectedId === variant.id
          const isSoldOut = variant.stock <= 0

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelect(variant, index)}
              disabled={isSoldOut}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] border transition-all duration-150 cursor-pointer",
                isSelected && !isSoldOut
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text)] shadow-sm"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]",
                isSoldOut
                  ? "border-[var(--border-light)] text-[var(--text-muted)]/50 bg-[var(--border-light)]/50 cursor-not-allowed line-through"
                  : ""
              )}
            >
              <span>{variant.name}</span>
              {!isSoldOut && (
                <span className="ml-1.5 text-[var(--text-muted)] text-xs">
                  {formatPrice(variant.price)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selectedId && (() => {
        const selected = variants.find((v) => v.id === selectedId)
        if (selected && selected.stock > 0 && selected.stock <= 5) {
          return (
            <p className="text-xs font-medium text-[var(--sale)]">
              Only {selected.stock} item{selected.stock > 1 ? "s" : ""} in stock!
            </p>
          )
        }
        return null
      })()}
    </div>
  )
}
