"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/1688-products";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn, ShoppingBag, Minus, Plus, Share2, ChevronDown, Info, Heart, Copy, Check, Star, MessageSquare, Loader2 } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import toast from "react-hot-toast";

export function Product1688({ slug }: { slug: string }) {
  const product = PRODUCTS.find(p => p.slug === slug);
  const [activeIdx, setActiveIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUIStore((s) => s.openCart);
  const [viewers] = useState(() => Math.floor(Math.random() * 13) + 3); // 3-15
  const [quantity, setQuantity] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [justToggledWishlist, setJustToggledWishlist] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addToCartState, setAddToCartState] = useState<"idle" | "adding" | "added">("idle");
  const [pulseWishlist, setPulseWishlist] = useState(false);

  // Wishlist
  const toggleWishlistItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const wishlisted = product ? isWishlisted(product.id) : false;

  // Related products: 4 random singles excluding current
  const related = useMemo(() => {
    const singles = PRODUCTS.filter(p => p.category === 'curated-singles' && p.slug !== slug);
    const shuffled = [...singles].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
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

  if (!product) return null;
  const p = product; // TS narrowing for closure below
  const images = p.images;
  const mainImg = images[activeIdx] || p.image;
  const hasCompare = p.compareAt && p.compareAt > p.price;

  function handleAddToCart() {
    setAddToCartState("adding");
    addItem({
      id: p.id,
      name: p.name,
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

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: p.name, url }).catch(() => {});
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
      name: p.name,
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

  function handleCopyCode() {
    navigator.clipboard.writeText("MYTH15").then(
      () => {
        setCopied(true);
        toast.success("Code copied!");
        setTimeout(() => setCopied(false), 2000);
      },
      () => toast.error("Could not copy code"),
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/collections/${p.category}`} className="hover:text-[var(--accent)]">{p.categoryName}</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text)]">{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <LazyImage src={mainImg} alt={p.name} fill sizes="(max-width:1024px) 100vw, 50vw" priority className="object-cover" containerClassName="absolute inset-0" />
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveIdx(i => i > 0 ? i-1 : images.length-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setActiveIdx(i => i < images.length-1 ? i+1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 mt-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveIdx(i)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === activeIdx ? 'border-[var(--accent)]' : 'border-transparent hover:border-[var(--border)]'}`}>
                  <LazyImage src={img} alt={`${p.name} ${i+1}`} fill sizes="80px" className="object-cover" containerClassName="absolute inset-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-xs text-[var(--accent)] uppercase tracking-wider font-medium">{p.categoryName}</p>
          <div className="flex items-start gap-2 mt-1.5">
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[var(--text)] flex-1">{p.name}</h1>
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

          {/* Social proof: X people viewing */}
          <p className="mt-1.5 text-xs text-[#C8944A] font-medium">
            {viewers} {viewers === 1 ? 'person is' : 'people are'} viewing this right now
          </p>

          {/* Delivery estimate */}
          <p className="mt-1.5 text-xs text-[var(--text-muted)]">
            Free shipping over $69.99 · Delivered in 7-14 business days
          </p>

          {/* Discount code badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">
            <span className="text-xs text-[var(--accent)] font-medium">
              Use code <span className="font-bold tracking-wider">MYTH15</span> for 15% off
            </span>
            <button
              onClick={handleCopyCode}
              className="shrink-0 flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-[var(--accent)]/20"
              aria-label="Copy discount code MYTH15"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--success)]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
              )}
            </button>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">
            <p>{p.description}</p>
            <p>Material: Natural stone · Elastic fit · One size fits most</p>
            <p>Hand-selected. Each piece is unique — natural stone variations are part of its character.</p>
            {p.category !== "curated-singles" && (
              <p className="text-[var(--accent)]/80 italic">
                From the {p.categoryName} — each piece in this collection is individually hand-finished.
              </p>
            )}
          </div>

          {/* Care note */}
          <div className="mt-4 p-3 rounded-lg bg-[#1A1812] border border-[#3A3220] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#C8944A] mt-0.5 shrink-0" />
            <p className="text-xs text-[#A89880] leading-relaxed">
              <span className="font-semibold text-[#C8944A]">Care: </span>
              Avoid water exposure. Store in a dry place. Clean with a soft cloth. Natural stones may vary slightly in color — this is a sign of authenticity, not a flaw.
            </p>
          </div>

          {p.images.length > 1 && (
            <div className="mt-5 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <p className="text-xs text-[var(--accent)] font-medium">{p.images.length} detail photos — use arrows to explore every angle</p>
            </div>
          )}

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
              className="w-full py-3.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

          <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>Free shipping over $69.99</span>
            <span>·</span>
            <span>30-day returns</span>
            <span>·</span>
            <span>Hand-selected</span>
          </div>

          {/* Story link */}
          <a
            href="/about"
            className="flex items-center gap-3 p-4 bg-[#1A1812] border border-[#3A3220] rounded-lg mt-6 hover:border-[var(--accent)]/40 transition-colors cursor-pointer group"
          >
            <span className="text-sm font-medium text-[var(--text)]">
              Every stone has a story —{" "}
              <span className="text-[var(--accent)] group-hover:underline">
                Read the Story
              </span>
            </span>
          </a>

          {/* ===== PRODUCT DETAILS ACCORDION ===== */}
          <div className="mt-6 border border-[var(--border)] rounded-lg overflow-hidden">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            >
              <span>Product Details</span>
              <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`} />
            </button>
            {detailsOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-[var(--border)] pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">Materials</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">Natural stone beads, elastic cord. Each bead is hand-selected for quality and character. Slight variations in color, pattern, and texture are expected and confirm the authenticity of natural gemstones.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">Sizing</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">One size fits most — designed for wrist sizes 6.5 to 7.5 inches (16.5–19 cm). The elastic cord provides a comfortable, flexible fit that adapts to your wrist. For custom sizing inquiries, contact us.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">Care Instructions</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">Avoid prolonged water exposure — remove before swimming, showering, or bathing. Store in a dry place away from direct sunlight. Clean gently with a soft, dry cloth. Avoid contact with perfumes, lotions, and harsh chemicals.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1.5">Shipping Info</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">Free standard shipping on orders over $69.99. US delivery in 7–14 business days. International delivery in 14–21 business days. Each order is carefully packaged in a MythRealms gift box with a story card.</p>
                </div>
              </div>
            )}
          </div>

          {/* ===== REVIEWS SECTION ===== */}
          <div className="mt-6 border border-[var(--border)] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="font-serif text-base font-semibold text-[var(--text)]">Reviews</h3>
            </div>
            {p.reviewCount > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const filled = i < Math.floor(p.rating);
                      const half = !filled && i < Math.ceil(p.rating);
                      return (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            filled
                              ? "fill-[var(--accent)] text-[var(--accent)]"
                              : half
                              ? "fill-[var(--accent)]/50 text-[var(--accent)]"
                              : "text-[var(--border)]"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm font-semibold text-[var(--text)]">{p.rating}</span>
                  <span className="text-xs text-[var(--text-muted)]">({p.reviewCount} {p.reviewCount === 1 ? "review" : "reviews"})</span>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  Write a Review
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  Be the first to review this piece. Your words help others discover their perfect stone.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--accent)]/30 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Write a Review
                </Link>
              </div>
            )}
            {/* Review highlights — trust-building even without real reviews */}
            <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs font-semibold text-[var(--accent)]">Hand-Selected</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Every stone inspected</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[var(--accent)]">30-Day Returns</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">No questions asked</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[var(--accent)]">Gift Boxed</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">With story card</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== YOU MAY ALSO LIKE ===== */}
      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[var(--border)]">
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((rp) => (
              <Link key={rp.slug} href={`/products/${rp.slug}`} className="group" aria-label={`View ${rp.name}`}>
                <div className="aspect-square rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all relative">
                  <LazyImage src={rp.image} alt={rp.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" containerClassName="absolute inset-0" />
                  {rp.tag && (
                    <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${rp.tag === 'New' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--surface)]/80 text-[var(--text)]'}`}>
                      {rp.tag}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 px-1">
                  <h4 className="text-sm font-medium text-[var(--text)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{rp.name}</h4>
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