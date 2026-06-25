"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { imageUrl } from "@/lib/images"
import { ProductImage } from "@/components/ui/ProductImage"

interface GalleryProps {
  images: string[]
  productName: string
}

export function Gallery({ images, productName }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const total = images.length
  const hasMultiple = total > 1

  const currentImage = images[activeIndex] || ""
  const isValidImage = currentImage && (currentImage.startsWith("http") || currentImage.startsWith("/"))
  const hasAnyValidImage = images.some((img) => img && (img.startsWith("http") || img.startsWith("/")))
  const hasMultipleValid = images.filter((img) => img && (img.startsWith("http") || img.startsWith("/"))).length > 1

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index)
      setImageLoaded(false)
    },
    []
  )

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total)
    setImageLoaded(false)
  }, [total])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total)
    setImageLoaded(false)
  }, [total])

  const openZoom = () => setZoomed(true)
  const closeZoom = useCallback(() => setZoomed(false), [])

  // Keyboard navigation for zoom modal
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeZoom()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    },
    [closeZoom, goPrev, goNext]
  )

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--border-light)] group">
        {isValidImage ? (
          <>
            <Image
              src={imageUrl(currentImage)}
              alt={`${productName} - image ${activeIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
              priority={activeIndex === 0}
              className={cn(
                "object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Skeleton pulse */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-[var(--border)]" />
            )}
          </>
        ) : (
          <ProductImage name={productName} className="absolute inset-0" />
        )}

        {/* Arrow navigation */}
        {hasMultiple && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[var(--text)] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[var(--text)] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Zoom button */}
        <button
          onClick={openZoom}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[var(--text)] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
          aria-label="Zoom image"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Image counter */}
        {hasMultiple && (
          <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm">
            {activeIndex + 1} / {total}
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="grid grid-cols-5 lg:grid-cols-7 gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={cn(
                "relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-[var(--border-light)] transition-all duration-200 cursor-pointer",
                index === activeIndex
                  ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]"
                  : "ring-1 ring-[var(--border)] hover:ring-[var(--text-muted)]"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              {img && (img.startsWith("http") || img.startsWith("/")) ? (
                <Image
                  src={imageUrl(img)}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 14vw, 80px"
                  className="object-cover"
                />
              ) : (
                <ProductImage name={`${productName} #${index + 1}`} className="absolute inset-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen zoom modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] backdrop-blur-sm animate-fade-in"
          onClick={closeZoom}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Image zoom modal"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={closeZoom}
            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Close zoom"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Zoomed image */}
          <div
            className="relative w-[90vw] h-[90vh] max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {isValidImage ? (
              <Image
                src={imageUrl(currentImage)}
                alt={`${productName} - image ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            ) : (
              <ProductImage name={productName} className="absolute inset-0" />
            )}
          </div>

          {/* Counter */}
          {hasMultiple && (
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {total}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
