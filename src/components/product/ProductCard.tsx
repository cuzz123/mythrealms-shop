"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, AlertTriangle } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/cart"
import toast from "react-hot-toast"
import { ProductImage } from "@/components/ui/ProductImage"

export interface Product {
  id: string
  name: string
  slug: string
  images: string[]
  variants: { price: number; stock?: number }[]
  comparePrice?: number | null
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const image = product.images[0] || ""
  const isValidImage = image && (image.startsWith("http") || image.startsWith("/"))
  const firstVariant = product.variants[0]
  const price = Number(firstVariant?.price ?? 0)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const hasSale = comparePrice && comparePrice > price
  const savings = hasSale ? comparePrice - price : 0

  // Check if product has multiple variants with different prices
  const variantPrices = product.variants.map(v => Number(v.price))
  const hasMultiplePrices = new Set(variantPrices).size > 1
  const minPrice = Math.min(...variantPrices)
  const showFrom = hasMultiplePrices

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price,
    })

    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className={cn("group relative", className)}>
      {/* Product link — covers image + info area, button sits on top */}
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--border-light)] will-change-transform [transform:translateZ(0)]">
          {isValidImage ? (
            <>
              <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn("object-cover transition-[transform] duration-500 group-hover:scale-110", imageLoaded ? "opacity-100" : "opacity-0")}
                onLoad={() => setImageLoaded(true)} />
              {!imageLoaded && (<div className="absolute inset-0 animate-pulse bg-[var(--border)]" />)}
            </>
          ) : (
            <ProductImage name={product.name} className="absolute inset-0" />
          )}
          {hasSale && (
            <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[var(--sale)] px-2.5 py-0.5 text-xs font-semibold text-white">Sale</span>
          )}
        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1.5">
          <h3 className="text-sm font-medium text-[var(--text)] line-clamp-2 font-serif">{product.name}</h3>
          <div className="flex items-center gap-2">
            {hasSale ? (
              <>
                <span className="text-sm font-semibold text-[var(--sale)]">{showFrom ? "from " : ""}{formatPrice(hasMultiplePrices ? minPrice : price)}</span>
                <span className="text-xs text-[var(--text-muted)] line-through">{formatPrice(comparePrice!)}</span>
                <span className="ml-auto text-xs font-semibold text-[var(--sale)]">Save {formatPrice(savings)}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-[var(--text)]">{showFrom ? "from " : ""}{formatPrice(hasMultiplePrices ? minPrice : price)}</span>
            )}
          </div>
          {/* Stock urgency badge */}
          {firstVariant?.stock !== undefined && firstVariant.stock > 0 && firstVariant.stock <= 3 && (
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Only {firstVariant.stock} left
            </div>
          )}
        </div>
      </Link>

      {/* Quick add button — outside the Link to avoid nested interactive elements */}
      <button onClick={handleQuickAdd}
        className="absolute bottom-[72px] right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--text)] shadow-md opacity-0 translate-y-2 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white hover:text-[var(--primary)] backdrop-blur-sm cursor-pointer"
        aria-label={`Add ${product.name} to cart`}>
        <ShoppingBag className="h-4 w-4" />
      </button>
    </div>
  )
            <AlertTriangle className="w-3 h-3" />
            Only {firstVariant.stock} left
          </div>
        )}
      </div>
    </Link>
  )
}
