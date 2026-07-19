"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  getStorefrontProducts,
  type StorefrontProduct,
} from "@/lib/storefront/catalog";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ShoppingBag, Minus, Plus, Share2, ChevronDown, Info, Heart, Check, Loader2 } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/ui/JsonLd";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import toast from "react-hot-toast";
import { productBenefitTriplet, productDisplayName, productShortDescription, realmForProduct } from "@/lib/brand";

export function Product1688({ product }: { product: StorefrontProduct }) {
  const slug = product.slug;
  const [activeIdx, setActiveIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUIStore((s) => s.openCart);
  const [quantity, setQuantity] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [justToggledWishlist, setJustToggledWishlist] = useState(false);
  const [addToCartState, setAddToCartState] = useState<"idle" | "adding" | "added">("idle");
  const [pulseWishlist, setPulseWishlist] = useState(false);

  // Back-in-stock notification
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyState, setNotifyState] = useState<"idle" | "submitting" | "submitted">("idle");
  const [notifyError, setNotifyError] = useState("");

  // Wishlist
  const toggleWishlistItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const wishlisted = isWishlisted(product.id);

  // Related products stay stable so hydration and merchandising are predictable.
  const related = useMemo(() => {
    return getStorefrontProducts()
      .filter((candidate) => candidate.slug !== slug)
      .slice(0, 4);
  }, [slug]);

  // Save to recently viewed
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mythrealms-recently-viewed");
      const existing: string[] = raw ? JSON.parse(raw) : [];
      const filtered = existing.filter(s => s !== slug);
      const updated = [slug, ...filtered].slice(0, 6);
      localStorage.setItem("mythrealms-recently-viewed", JSON.stringify(updated));
    } catch { /* localStorage not available */ }
  }, [slug]);

  const p = product;
  const displayName = productDisplayName(p);
  const displayDescription = productShortDescription(p);
  const benefitTriplet = productBenefitTriplet(p);
  const realm = realmForProduct(p);
  const images = p.images;
  const mainImg = images[activeIdx] || p.image;
  const hasCompare = p.compareAt && p.compareAt > p.price;

  function handleAddToCart() {
    setAddToCartState("adding");
    addItem({
      id: p.id,
      name: displayName,
      slug: p.slug,
      image: p.image,
      price: p.price,
    }, quantity);
    setTimeout(() => {
      setAddToCartState("added");
      toast.success(`${quantity > 1 ? `${quantity} items` : "Item"} added to cart!`);
      openCart();
      setTimeout(() => setAddToCartState("idle"), 1000);
    }, 400);
  }

  async function handleNotifyMe(e: React.FormEvent) {
    e.preventDefault();
    if (!notifyEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
      setNotifyError("Please enter a valid email");
      return;
    }
    setNotifyState("submitting");
    setNotifyError("");
    try {
      const res = await fetch("/api/stock-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: p.id,
          productName: displayName,
          email: notifyEmail.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotifyState("submitted");
        toast.success(data.message || "You'll be notified when back in stock!");
      } else {
        setNotifyError(data.error || "Failed to subscribe");
        setNotifyState("idle");
      }
    } catch {
      setNotifyError("Something went wrong. Please try again.");
      setNotifyState("idle");
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: displayName, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(
        () => toast.success("Link copied!"),
        () => toast.error("Could not copy link"),
      );
    }
  }

  function handleToggleWishlist() {
    toggleWishlistItem({
      id: p.id,
      name: displayName,
      slug: p.slug,
      image: p.image,
      price: p.price,
    });
    setJustToggledWishlist(true);
    setPulseWishlist(true);
    setTimeout(() => setJustToggledWishlist(false), 300);
    setTimeout(() => setPulseWishlist(false), 600);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* JSON-LD Structured Data */}
      <ProductJsonLd
        name={displayName}
        description={displayDescription}
        images={p.images.map((image) => image.startsWith("http") ? image : `${siteUrl}${image}`)}
        price={p.price}
        currency="USD"
        category={p.categoryName}
        url={`${siteUrl}/products/${p.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteUrl}/` },
          { name: p.categoryName, url: `${siteUrl}/collections/${p.category}` },
          { name: displayName, url: `${siteUrl}/products/${p.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/collections/${p.category}`} className="hover:text-[var(--accent)]">{p.categoryName}</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text)]">{displayName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <LazyImage src={mainImg} alt={displayName} fill sizes="(max-width:1024px) 100vw, 50vw" priority className="object-cover" containerClassName="absolute inset-0" />
            {images.length > 1 && (
              <>
                <button type="button" aria-label={`Previous product image, ${activeIdx + 1} of ${images.length}`} onClick={() => setActiveIdx(i => i > 0 ? i-1 : images.length-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" aria-label={`Next product image, ${activeIdx + 1} of ${images.length}`} onClick={() => setActiveIdx(i => i < images.length-1 ? i+1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 mt-3">
              {images.map((img, i) => (
                <button key={i} type="button" aria-label={`View image ${i + 1} of ${images.length}`} aria-current={i === activeIdx ? "true" : undefined} onClick={() => setActiveIdx(i)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === activeIdx ? 'border-[var(--accent)]' : 'border-transparent hover:border-[var(--border)]'}`}>
                  <LazyImage src={img} alt={`${displayName} ${i+1}`} fill sizes="80px" className="object-cover" containerClassName="absolute inset-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-xs text-[var(--accent)] uppercase tracking-wider font-medium">{realm}</p>
          <div className="flex items-start gap-2 mt-1.5">
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[var(--text)] flex-1">{displayName}</h1>
            <button
              onClick={handleToggleWishlist}
              className={`shrink-0 mt-1 w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 ${
                wishlisted
                  ? "border-[var(--sale)] text-[var(--sale)] bg-[var(--sale)]/10"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--sale)] hover:border-[var(--sale)]/40"
              } ${justToggledWishlist ? "scale-125" : "scale-100"} ${pulseWishlist ? "animate-heart-pulse" : ""}`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4 h-4 transition-transform duration-200 ${wishlisted ? "fill-current" : ""} ${justToggledWishlist ? "scale-110" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="shrink-0 mt-1 w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-colors"
              aria-label="Share this product"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Price with compareAt */}
          <div className="mt-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-[var(--text)]">{formatPrice(p.price)}</span>
              {hasCompare && (
                <span className="text-lg text-[var(--text-muted)] line-through">{formatPrice(p.compareAt!)}</span>
              )}
            </div>
          </div>

          {/* Eco-friendly badge */}
          <div className="flex items-center gap-2 mt-3 text-xs text-[var(--success)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
            Pearl jewelry - Gift-ready packaging - Everyday styling
          </div>

          {/* Delivery estimate */}
          <p className="mt-1.5 text-xs text-[var(--text-muted)]">
            Free shipping over $69.99 - Delivery estimate shown at checkout
          </p>

          <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">
            <p>{displayDescription}</p>
            <p className="text-[var(--accent)]">{benefitTriplet}</p>
            <p>See the product photography for finish, construction, and scale details.</p>
            <p>Use the full gallery to compare shape, setting, scale, and finish before ordering.</p>
            {p.category !== "curated-singles" && (
              <p className="text-[var(--accent)]/80 italic">
                From the {p.categoryName} - chosen for the {realm.toLowerCase()} realm.
              </p>
            )}
          </div>

          {/* Care note */}
          <div className="mt-4 p-3 rounded-lg bg-[#1A1812] border border-[#3A3220] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#C8944A] mt-0.5 shrink-0" />
            <p className="text-xs text-[#A89880] leading-relaxed">
              <span className="font-semibold text-[#C8944A]">Care: </span>
              Avoid water exposure. Store in a dry place. Clean gently with a soft cloth.
            </p>
          </div>

          {p.images.length > 1 && (
            <div className="mt-5 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <p className="text-xs text-[var(--accent)] font-medium">{p.images.length} product photos - use the controls to explore each view</p>
            </div>
          )}

          {p.inStock === false ? (
            /* Back-in-Stock Notification Form */
            <div className="mt-6 space-y-3">
              <div className="p-4 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/15">
                <p className="text-sm font-medium text-[var(--text)] mb-1">Out of Stock</p>
                <p className="text-xs text-[var(--text-muted)] mb-3">Enter your email to be notified when this item is back in stock.</p>
                {notifyState === "submitted" ? (
                  <div className="flex items-center gap-2 text-sm text-[var(--success)]">
                    <Check className="w-4 h-4" />
                    <span>You&apos;ll be notified when this item is back in stock!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNotifyMe} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => { setNotifyEmail(e.target.value); setNotifyError(""); }}
                        placeholder="your@email.com"
                        required
                        className={`flex-1 px-3 py-2.5 rounded-lg border text-sm bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] ${notifyError ? 'border-[var(--sale)]' : 'border-[var(--border)]'}`}
                      />
                      <button
                        type="submit"
                        disabled={notifyState === "submitting"}
                        className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg)] font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                      >
                        {notifyState === "submitting" ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          "Notify Me"
                        )}
                      </button>
                    </div>
                    {notifyError && (
                      <p className="text-xs text-[var(--sale)]">{notifyError}</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-muted)]">Qty</span>
                <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-[var(--text)] bg-[var(--surface)]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-10 h-10 flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addToCartState !== "idle"}
                className="w-full py-3.5 rounded-lg bg-[var(--accent)] text-[var(--bg)] font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {addToCartState === "adding" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                ) : addToCartState === "added" ? (
                  <><Check className="w-4 h-4" /> Added!</>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /> Add to Cart — {formatPrice(p.price)}</>
                )}
              </button>
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>Free shipping over $69.99</span>
            <span>·</span>
            <span>30-day returns</span>
            <span>·</span>
            <span>Gift-ready packaging</span>
          </div>

          {/* Story link */}
          <a
            href="/about"
            className="flex items-center gap-3 p-4 bg-[#1A1812] border border-[#3A3220] rounded-lg mt-6 hover:border-[var(--accent)]/40 transition-colors cursor-pointer group"
          >
            <span className="text-sm font-medium text-[var(--text)]">
              The story behind The Pearl Edit -{" "}
              <span className="text-[var(--accent)] group-hover:underline">
                Read Our Story
              </span>
            </span>
          </a>

          {/* ===== PRODUCT DETAILS ACCORDION ===== */}
          <div className="mt-6 border border-[var(--border)] rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setDetailsOpen(!detailsOpen)}
              aria-expanded={detailsOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            >
              <span>Product Details</span>
              <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`} />
            </button>
            {detailsOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-[var(--border)] pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">Materials</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">See the product photography for finish and construction details. Pearl tone and surface texture may vary slightly between pieces.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">Sizing</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">Use the scale shown in the product photography as a guide. Contact us before ordering if you need help choosing a fit.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">Care Instructions</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">Avoid prolonged water exposure. Remove before swimming, showering, or bathing. Store in a dry place away from direct sunlight. Clean gently with a soft, dry cloth.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">How to Wear Your Intention</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">Choose one word for the day: calm, renewal, boundaries, or soft power. Put the piece on before you leave. When you notice it in the light, let it bring you back to that word.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">Shipping Info</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">Free standard shipping on orders over $69.99. Delivery timing is shown at checkout and can vary by destination and carrier.</p>
                </div>
              </div>
            )}
          </div>

          <section className="mt-8" aria-labelledby="learn-about-your-pearls-title">
            <h3 id="learn-about-your-pearls-title" className="font-serif text-xl font-medium text-[var(--text)]">
              Learn about your pearls
            </h3>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
              <Link href="/pearls/care" className="border-b border-[var(--text)] pb-1 text-[var(--text)]">
                How to care for pearl jewelry
              </Link>
              <Link href="/pearls/how-to-wear" className="border-b border-[var(--text)] pb-1 text-[var(--text)]">
                How to wear pearls
              </Link>
              <Link href="/pearls/freshwater-pearls" className="border-b border-[var(--text)] pb-1 text-[var(--text)]">
                What are freshwater pearls?
              </Link>
              <Link href="/gifts" className="border-b border-[var(--text)] pb-1 text-[var(--text)]">
                Shop pearl gifts
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* ===== YOU MAY ALSO LIKE ===== */}
      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[var(--border)]">
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((rp) => (
              <Link key={rp.slug} href={`/products/${rp.slug}`} className="group" aria-label={`View ${productDisplayName(rp)}`}>
                <div className="aspect-square rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all relative">
                  <LazyImage src={rp.image} alt={productDisplayName(rp)} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" containerClassName="absolute inset-0" />
                  {rp.tag && (
                    <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${rp.tag === 'New' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--surface)]/80 text-[var(--text)]'}`}>
                      {rp.tag}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 px-1">
                  <h3 className="text-sm font-medium text-[var(--text)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{productDisplayName(rp)}</h3>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-[var(--text)]">{formatPrice(rp.price)}</span>
                    {rp.compareAt && rp.compareAt > rp.price && (
                      <span className="text-[10px] text-[var(--text-muted)] line-through">{formatPrice(rp.compareAt)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

