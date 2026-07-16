import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { imageUrl } from "@/lib/images"
import { ProductImage } from "@/components/ui/ProductImage"

interface GalleryProps {
  images: string[]
  productName: string
}

function isValidImage(image: string) {
  return image.startsWith("http") || image.startsWith("/")
}

export function Gallery({ images, productName }: GalleryProps) {
  const galleryId = `gallery-${productName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  const validImages = images.filter(isValidImage)
  const hasMultiple = validImages.length > 1

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--border-light)]">
        <ProductImage name={productName} className="absolute inset-0" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        id={`${galleryId}-stage`}
        className="native-gallery relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--border-light)]"
      >
        {validImages.map((image, index) => {
          const imageId = `${galleryId}-${index + 1}`
          const previousImageId = `${galleryId}-${index === 0 ? validImages.length : index}`
          const nextImageId = `${galleryId}-${index === validImages.length - 1 ? 1 : index + 2}`

          return (
            <figure id={imageId} key={imageId} className="native-gallery-slide absolute inset-0 m-0">
              <Image
                src={imageUrl(image)}
                alt={`${productName} - image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                priority={index === 0}
                className="object-cover"
              />

              {hasMultiple && (
                <>
                  <a
                    href={`#${previousImageId}`}
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--text)] shadow-md transition-colors hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </a>
                  <a
                    href={`#${nextImageId}`}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--text)] shadow-md transition-colors hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </a>
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm">
                    {index + 1} / {validImages.length}
                  </span>
                </>
              )}
            </figure>
          )
        })}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-5 gap-2 lg:grid-cols-7">
          {validImages.map((image, index) => {
            const imageId = `${galleryId}-${index + 1}`
            return (
              <a
                key={imageId}
                href={`#${imageId}`}
                className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-[var(--border-light)] ring-1 ring-[var(--border)] transition-colors hover:ring-2 hover:ring-[var(--accent)]"
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={imageUrl(image)}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 14vw, 80px"
                  className="object-cover"
                />
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
