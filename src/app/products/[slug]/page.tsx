import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Gallery } from "@/components/product/Gallery";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { ProductActions } from "@/components/product/ProductActions";
import { Tabs } from "@/components/ui/Tabs";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/ui/JsonLd";
import { formatPrice } from "@/lib/utils";
import { safeJsonParse } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import { Product1688 } from "./1688-product";
import { PRODUCTS as P1688 } from "@/lib/1688-products";
import { Star, Play, ShieldCheck } from "lucide-react";
import { imageUrl, absoluteImageUrl } from "@/lib/images";

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, select: { name: true, description: true, images: true, category: { select: { name: true } }, stone: true, variants: { select: { price: true }, orderBy: { price: "asc" } } } });
  if (!product) return { title: "Product Not Found — MythRealms" };
  const images = safeJsonParse<string[]>(product.images as string, []);
  const priceFrom = product.variants[0]?.price ? ` from $${product.variants[0].price.toFixed(0)}` : "";
  const stoneTag = product.stone ? `${product.stone} · ` : "";
  return {
    title: `${product.name}${priceFrom} — MythRealms Luxury Jewelry`,
    description: `${stoneTag}${product.description.slice(0, 150)}`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: images[0] ? [{ url: absoluteImageUrl(images[0]) }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 155),
    },
  };
}


export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1688 static products
  if (P1688.some(p => p.slug === slug)) {
    return <Product1688 slug={slug} />;
  }

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  const images = safeJsonParse<string[]>(product.images as string, []);
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  // Related products
  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { variants: true },
    take: 6,
  });

  const relatedParsed = related.map((p) => ({
    ...p,
    images: safeJsonParse<string[]>(p.images as string, []),
  }));

  // Parse details for beast properties or stone properties
  const details = safeJsonParse<Record<string, unknown> | null>(product.details as string, null);
  const isCuratedStones = product.category?.slug === "curated-stones";

  // Stone care instructions by type
  const stoneCare: Record<string, string> = {
    Amethyst: "Cleanse with lukewarm water and a soft cloth. Avoid prolonged sun exposure to preserve color. Recharge under the full moon.",
    "Rose Quartz": "Rinse gently with water and pat dry. Avoid harsh chemicals and ultrasonic cleaners. Charge with selenite or moonlight.",
    "Black Obsidian": "Wipe with a dry or slightly damp cloth. This stone absorbs negative energy — cleanse regularly under running water or with sage smoke.",
    Moonstone: "Handle with care — moonstone is softer than quartz. Clean with a dry microfiber cloth only. Avoid water, chemicals, and sharp impacts.",
    "Tiger's Eye": "Clean with a soft damp cloth and mild soap if needed. Avoid abrasive materials. Recharge in indirect sunlight.",
  };

  // Determine the first tab label and content
  const firstTabLabel = isCuratedStones ? "The Stone" : "Details";
  const firstTabContent = (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-[var(--text)] mb-2">About This Piece</h4>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {product.description}
        </p>
      </div>
      {isCuratedStones && product.stone && (
        <div>
          <h4 className="font-semibold text-[var(--text)] mb-2">Stone Type & Origin</h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text)]">{product.stone}</strong> — hand-selected for quality and character. Each {product.stone.toLowerCase()} bead is sourced from ethical mines and individually inspected before stringing.
          </p>
          {stoneCare[product.stone] && (
            <div className="mt-3 p-4 rounded-lg bg-[var(--border-light)]/30 border border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Care Instructions</p>
              <p className="text-sm text-[var(--text-secondary)]">{stoneCare[product.stone]}</p>
            </div>
          )}
        </div>
      )}
      {isCuratedStones && details?.stoneProperties ? (
        <div>
          <h4 className="font-semibold text-[var(--text)] mb-2">Metaphysical Properties</h4>
          <ul className="space-y-2">
            {(details.stoneProperties as any[]).map((sp: any, i: number) => (
              <li key={i} className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text)]">{sp.stone || sp.name}</strong> — {sp.benefit || sp.property}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {!isCuratedStones && (details?.beastProperties || details?.stoneProperties) ? (
        <div>
          <h4 className="font-semibold text-[var(--text)] mb-2">Stone Properties</h4>
          <ul className="space-y-2">
            {((details.beastProperties || details.stoneProperties) as any[]).map(
              (sp: any, i: number) => (
                <li key={i} className="text-sm text-[var(--text-secondary)]">
                  <strong className="text-[var(--text)]">{sp.beast || sp.stone}</strong> — {sp.benefit}
                </li>
              )
            )}
          </ul>
        </div>
      ) : null}
      {details?.specs ? (
        <div>
          <h4 className="font-semibold text-[var(--text)] mb-2">Specifications</h4>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(details.specs as Record<string, unknown>).map(
                ([key, value]) => (
                  <tr key={key} className="border-b border-[var(--border)]">
                    <td className="py-2 font-medium text-[var(--text)] w-40">{key}</td>
                    <td className="py-2 text-[var(--text-secondary)]">
                      {value as string}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* JSON-LD Structured Data */}
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/` },
        { name: product.category.name, url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/collections/${product.category.slug}` },
        { name: product.name, url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/products/${product.slug}` },
      ]} />
      <ProductJsonLd
        name={product.name}
        description={product.description}
        images={images.map(i => absoluteImageUrl(i))}
        price={product.variants[0]?.price || 0}
        ratingValue={avgRating}
        reviewCount={product.reviews.length}
        url={`${process.env.NEXT_PUBLIC_APP_URL || ""}/products/${product.slug}`}
        category={product.category.name}
        sku={product.variants[0]?.sku || undefined}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-4 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <Link href={`/collections/${product.category.slug}`} className="hover:text-[var(--text)]">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] truncate max-w-[300px]">{product.name}</span>
      </nav>

      {/* Product Main */}
      <div className="grid lg:grid-cols-2 gap-12 pb-12">
        <Gallery images={images} productName={product.name} />

        <div>
          <h1 className="font-serif text-3xl font-bold leading-tight mb-3 text-[var(--text)]">
            {product.name}
          </h1>

          {/* Reviews inline */}
          {product.reviews.length > 0 && (
            <StarRating rating={avgRating} count={product.reviews.length} linkTo="#reviews" />
          )}

          {/* Guardian Tag — emotional resonance */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-sm text-[var(--accent)]">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isCuratedStones && product.stone === "Amethyst" && "Wear calm. Wear clarity. Wear the answers already within you."}
              {isCuratedStones && product.stone === "Rose Quartz" && "Wear softness as strength. Wear the heart that keeps opening."}
              {isCuratedStones && product.stone === "Black Obsidian" && "Wear your boundary. Wear the armor you chose."}
              {isCuratedStones && product.stone === "Moonstone" && "Wear the new moon. Wear who you are becoming."}
              {isCuratedStones && product.stone === "Tiger's Eye" && "Wear quiet confidence. Wear the nerve to act."}
              {!isCuratedStones && "Hand-selected. Artisan-finished. Worn with intention."}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4"><span className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Options</span><SizeGuideModal /></div>
          <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded-lg p-3 mb-4 text-xs text-[var(--text-muted)]">
            Crafted to order · Ships in 2-3 weeks · Free shipping over $69.99
          </div>
          <ProductActions
            productId={product.id}
            productName={product.name}
            productSlug={product.slug}
            images={images}
            variants={product.variants}
            comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
          />

          {/* Trust signals */}
          <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              Handcrafted to order
            </span>
            <span className="text-[var(--border)]">|</span>
            <span>Free shipping over $69.99</span>
            <span className="text-[var(--border)]">|</span>
            <span>30-day returns</span>
          </div>

          {/* Story badge */}
          <Link href="/about" className="flex items-center gap-3 p-4 bg-[#1A1812] border border-[#3A3220] rounded-lg mt-6 hover:border-[var(--accent)]/40 transition-colors cursor-pointer group">
            <Play className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors" />
            <span className="text-sm font-medium text-[var(--text)]">
              {isCuratedStones ? "The Intention Behind This Stone" : "The Story Behind This Piece"} —{" "}
              <span className="text-[var(--accent)] group-hover:underline">Read the Story</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            label: firstTabLabel,
            content: firstTabContent,
          },
          {
            label: "Shipping Policy",
            content: (
              <div className="space-y-4 text-sm text-[var(--text-secondary)]">
                <p>We offer <strong>worldwide free shipping</strong> on all orders over $69.99. Orders are processed within 2-5 business days.</p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]"><th className="text-left py-2">Method</th><th className="text-left py-2">Delivery</th><th className="text-left py-2">Cost</th></tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--border)]"><td className="py-2">Standard</td><td className="py-2">7-20 business days</td><td className="py-2">$4.99 (Free over $69.99)</td></tr>
                    <tr className="border-b border-[var(--border)]"><td className="py-2">Express (DHL)</td><td className="py-2">6-8 business days</td><td className="py-2">$15.99</td></tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            label: "Refund Policy",
            content: (
              <div className="space-y-4 text-sm text-[var(--text-secondary)]">
                <p>30-day money-back guarantee. Items must be unused and in original packaging. Return shipping at customer's expense unless due to our error.</p>
                <p>Contact: <strong>support@mythrealms.com</strong></p>
              </div>
            ),
          },
        ]}
      />

      {/* Reviews */}
      <section id="reviews" className="py-12 border-t border-[var(--border)]">
        <h3 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">
          Customer Reviews
        </h3>
        {product.reviews.length > 0 ? (
          <StarRating rating={avgRating} size="lg" showValue count={product.reviews.length} />
        ) : (
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            No reviews yet — be among the first to share your experience with this piece.
          </p>
        )}
        <div className="space-y-4">
          {product.reviews.slice(0, 5).map((review) => (
            <div
              key={review.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[var(--border-light)] flex items-center justify-center font-bold text-[var(--text-muted)] text-sm">
                  {review.user?.name?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--text)]">
                    {review.user?.name || "Anonymous"}
                  </p>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                {review.isVerified && (
                  <span className="ml-auto text-xs text-[var(--success)] font-medium">
                    Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedParsed.length > 0 && (
        <section className="py-12 border-t border-[var(--border)]">
          <h3 className="font-serif text-2xl font-bold text-[var(--text)] mb-6">
            You May Also Like
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {relatedParsed.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="flex-shrink-0 w-60 bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-[var(--border-light)] relative">
                  {p.images[0] && (p.images[0] as string).startsWith("http") ? (
                    <Image
                      src={p.images[0] as string}
                      alt={p.name}
                      fill
                      sizes="240px"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : p.images[0] ? (
                    <Image
                      src={imageUrl(p.images[0] as string)}
                      alt={p.name}
                      fill
                      sizes="240px"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ProductImage name={p.name} className="absolute inset-0" />
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-medium text-[var(--text-secondary)] line-clamp-2 mb-2">
                    {p.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--sale)]">
                      {formatPrice(p.variants[0]?.price || 0)}
                    </span>
                    {p.comparePrice && (
                      <span className="text-xs text-[var(--text-muted)] line-through">
                        {formatPrice(p.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <StickyAddToCart
        productId={product.id}
        productName={product.name}
        productSlug={product.slug}
        image={images[0]}
        price={product.variants[0]?.price || 0}
        variantId={product.variants[0]?.id}
        variantName={product.variants[0]?.name}
      />
    </div>
  );
}
