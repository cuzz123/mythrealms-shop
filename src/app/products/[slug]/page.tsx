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
import { StarRating } from "@/components/ui/StarRating";
import { Star, Play, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, select: { name: true, description: true, images: true, category: { select: { name: true } }, stone: true, variants: { select: { price: true }, orderBy: { price: "asc" } } } });
  if (!product) return { title: "Product Not Found — MythRealms" };
  const images = JSON.parse(product.images as string) as string[];
  const priceFrom = product.variants[0]?.price ? ` from $${product.variants[0].price.toFixed(0)}` : "";
  const stoneTag = product.stone ? `${product.stone} · ` : "";
  return {
    title: `${product.name}${priceFrom} — MythRealms Luxury Jewelry`,
    description: `${stoneTag}${product.description.slice(0, 150)}`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: images[0] ? [{ url: images[0].startsWith("http") ? images[0] : `${process.env.NEXT_PUBLIC_APP_URL || ""}${images[0]}` }] : [],
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
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  const images = JSON.parse(product.images as string) as string[];
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
    images: JSON.parse(p.images as string),
  }));

  // Parse details for beast properties or stone properties
  const details = product.details ? JSON.parse(product.details as string) : null;

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
        images={images}
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
          <StarRating rating={avgRating} count={product.reviews.length} linkTo="#reviews" />

          {/* Guardian Tag — emotional resonance */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-sm text-[var(--accent)]">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {product.slug.includes("nine-tailed") && "For the one who's been underestimated"}
              {product.slug.includes("qilin") && "For the one who chooses peace when everyone fights"}
              {product.slug.includes("azure-dragon") && "For the one carrying too much alone"}
              {product.slug.includes("phoenix") && "For the one rebuilding from ashes"}
              {product.slug.includes("white-tiger") && "For the one protecting others at their own cost"}
              {product.slug.includes("black-tortoise") && "For the one still standing after everything"}
              {product.slug.includes("bai-ze") && "For the one who sees what others don't"}
              {product.slug.includes("kun-peng") && "For the one in a season of change"}
              {product.slug.includes("four-symbols") && "For the one who contains multitudes"}
              {product.slug.includes("28-mansions") && "For the one seeking their place in the universe"}
              {product.slug.includes("taotie") && "For the one who knows when to say enough"}
              {product.slug.includes("yinglong") && "For the one destined to rise above"}
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

          {/* Social proof */}
          <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              {Math.floor(Math.random() * 8 + 3)} people viewing now
            </span>
            <span className="text-[var(--border)]">|</span>
            <span>Free shipping over $69.99</span>
          </div>

          {/* Mythical Legend badge */}
          <a href="#tabs" className="flex items-center gap-3 p-4 bg-[#1A1812] border border-[#3A3220] rounded-lg mt-6 hover:border-[var(--accent)]/40 transition-colors cursor-pointer group">
            <Play className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors" />
            <span className="text-sm font-medium text-[var(--text)]">
              Ancient Legend Behind This Piece —{" "}
              <span className="text-[var(--accent)] group-hover:underline">Read the Story</span>
            </span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            label: "Details",
            content: (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[var(--text)] mb-2">About This Piece</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {product.description}
                  </p>
                </div>
                {(details?.beastProperties || details?.stoneProperties) && (
                  <div>
                    <h4 className="font-semibold text-[var(--text)] mb-2">Mythical Properties</h4>
                    <ul className="space-y-2">
                      {(details.beastProperties || details.stoneProperties).map(
                        (sp: any, i: number) => (
                          <li key={i} className="text-sm text-[var(--text-secondary)]">
                            <strong className="text-[var(--text)]">{sp.beast || sp.stone}</strong> — {sp.benefit}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {details?.specs && (
                  <div>
                    <h4 className="font-semibold text-[var(--text)] mb-2">Specifications</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(details.specs).map(
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
                )}
              </div>
            ),
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
        <StarRating rating={avgRating} size="lg" showValue count={product.reviews.length} />
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
              <a
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
                      unoptimized
                    />
                  ) : p.images[0] ? (
                    <Image
                      src={p.images[0] as string}
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
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
