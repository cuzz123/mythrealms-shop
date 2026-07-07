"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCartStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import { imageUrl } from "@/lib/images";
import { cn, formatPrice } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  variants: { price: number; stock?: number }[];
  comparePrice?: number | null;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);

  const image = product.images[0] || "";
  const secondImage = product.images[1] || "";
  const hasSecondImage = product.images.length >= 2;
  const isValidImage = image && (image.startsWith("http") || image.startsWith("/"));
  const firstVariant = product.variants[0];
  const price = Number(firstVariant?.price ?? 0);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const hasSale = Boolean(comparePrice && comparePrice > price);
  const savings = hasSale && comparePrice ? comparePrice - price : 0;
  const variantPrices = product.variants.map((variant) => Number(variant.price));
  const hasMultiplePrices = new Set(variantPrices).size > 1;
  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : price;
  const showFrom = hasMultiplePrices;
  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price,
    });

    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price,
    });

    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <div className={cn("group relative", className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--border-light)]">
          {isValidImage ? (
            <>
              <Image
                src={imageUrl(image)}
                alt={`${product.name} - MythRealms pearl and gemstone jewelry`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                  hasSecondImage ? "opacity-100 group-hover:opacity-0" : ""
                }`}
              />
              {hasSecondImage && (
                <Image
                  src={imageUrl(secondImage)}
                  alt={`${product.name} - alternate jewelry view`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  className="object-cover opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <ProductImage name={product.name} className="absolute inset-0" />
          )}
          {hasSale && (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[var(--sale)] px-2.5 py-0.5 text-xs font-semibold text-white">
              Sale
            </span>
          )}
        </div>

        <div className="mt-3 space-y-1.5">
          <h3 className="line-clamp-2 font-serif text-sm font-medium text-[var(--text)]">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {hasSale ? (
              <>
                <span className="text-sm font-semibold text-[var(--sale)]">
                  {showFrom ? "from " : ""}
                  {formatPrice(hasMultiplePrices ? minPrice : price)}
                </span>
                {comparePrice && (
                  <span className="text-xs text-[var(--text-muted)] line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
                <span className="ml-auto text-xs font-semibold text-[var(--sale)]">
                  Save {formatPrice(savings)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-[var(--text)]">
                {showFrom ? "from " : ""}
                {formatPrice(hasMultiplePrices ? minPrice : price)}
              </span>
            )}
          </div>
          {firstVariant?.stock !== undefined && firstVariant.stock > 0 && firstVariant.stock <= 3 && (
            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              Only {firstVariant.stock} left
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleToggleWishlist}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 translate-y-1 cursor-pointer items-center justify-center rounded-full bg-white/80 text-[var(--sale)] opacity-0 shadow-md backdrop-blur-sm transition-[opacity,transform] duration-200 hover:bg-white group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
      </button>

      <button
        type="button"
        onClick={handleQuickAdd}
        className="absolute bottom-[72px] right-3 z-10 flex h-9 w-9 translate-y-2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[var(--text)] opacity-0 shadow-md backdrop-blur-sm transition-[opacity,transform] duration-200 hover:bg-white hover:text-[var(--primary)] group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:bg-[var(--accent)] max-sm:text-[var(--bg)] max-sm:opacity-100 max-sm:hover:bg-[var(--accent-hover)]"
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingBag className="h-4 w-4" />
      </button>
    </div>
  );
}
