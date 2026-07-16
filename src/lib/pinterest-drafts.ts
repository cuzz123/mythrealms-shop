import { PinterestDraftStatus, type PinterestContentDraft } from "@prisma/client";
import { db } from "@/lib/db";
import { generatePinterestContent, getEligiblePinterestProducts } from "@/lib/pinterest-content";
import { publishPinterestPin } from "@/lib/pinterest-publisher";

const MOODS = ["styling", "gifting", "story", "everyday wear"];

export type SerializedPinterestDraft = Omit<PinterestContentDraft, "tags"> & {
  tags: string[];
};

export function serializePinterestDraft(draft: PinterestContentDraft): SerializedPinterestDraft {
  let tags: string[] = [];

  try {
    const parsed = JSON.parse(draft.tags) as unknown;
    if (Array.isArray(parsed)) {
      tags = parsed.filter((tag): tag is string => typeof tag === "string");
    }
  } catch {
    tags = [];
  }

  return { ...draft, tags };
}

export async function createDailyPinterestDraft() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const existing = await db.pinterestContentDraft.findUnique({ where: { dateKey } });
  if (existing) return { draft: existing, created: false };

  return createPinterestDraft({ dateKey });
}

export async function createPinterestDraft(options: { productSlug?: string; mood?: string; dateKey?: string } = {}) {
  const products = getEligiblePinterestProducts();
  if (products.length === 0) {
    throw new Error("No active, in-stock products are available for Pinterest content");
  }

  const product = options.productSlug
    ? products.find((item) => item.slug === options.productSlug)
    : await selectNextProduct(products);

  if (!product) {
    throw new Error("The selected product is unavailable for Pinterest content");
  }

  const draftCount = await db.pinterestContentDraft.count();
  const content = await generatePinterestContent(product, options.mood || MOODS[draftCount % MOODS.length]);

  const draft = await db.pinterestContentDraft.create({
    data: {
      productSlug: product.slug,
      productName: product.name,
      imageUrl: content.imageUrl,
      link: content.link,
      title: content.title,
      description: content.description,
      tags: JSON.stringify(content.tags),
      dateKey: options.dateKey,
    },
  });

  return { draft, created: true };
}

export async function publishPinterestDraft(id: string) {
  const claimed = await db.pinterestContentDraft.updateMany({
    where: { id, status: PinterestDraftStatus.APPROVED },
    data: { status: PinterestDraftStatus.PUBLISHING, error: null },
  });

  if (claimed.count === 0) {
    throw new Error("Only approved drafts can be published");
  }

  const draft = await db.pinterestContentDraft.findUnique({ where: { id } });
  if (!draft) throw new Error("Pinterest draft not found");

  try {
    const result = await publishPinterestPin({
      title: draft.title,
      description: draft.description,
      link: draft.link,
      imageUrl: draft.imageUrl,
    });

    return await db.pinterestContentDraft.update({
      where: { id },
      data: {
        status: PinterestDraftStatus.PUBLISHED,
        remotePinId: result.pinId,
        publishedAt: new Date(),
        error: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Pinterest publishing failed";
    await db.pinterestContentDraft.update({
      where: { id },
      data: { status: PinterestDraftStatus.FAILED, error: message },
    });
    throw new Error(message);
  }
}

export async function publishDuePinterestDrafts(limit = 5) {
  const now = new Date();
  const drafts = await db.pinterestContentDraft.findMany({
    where: {
      status: PinterestDraftStatus.APPROVED,
      scheduledFor: { lte: now },
    },
    orderBy: { scheduledFor: "asc" },
    take: limit,
  });

  const results = await Promise.allSettled(drafts.map((draft) => publishPinterestDraft(draft.id)));
  return {
    attempted: drafts.length,
    published: results.filter((result) => result.status === "fulfilled").length,
    failed: results.filter((result) => result.status === "rejected").length,
  };
}

async function selectNextProduct<T extends { slug: string }>(products: T[]): Promise<T> {
  const priorDrafts = await db.pinterestContentDraft.findMany({
    select: { productSlug: true },
    orderBy: { createdAt: "desc" },
    take: products.length,
  });
  const usedSlugs = new Set(priorDrafts.map((draft) => draft.productSlug));
  const unusedProduct = products.find((product) => !usedSlugs.has(product.slug));

  return unusedProduct || products[priorDrafts.length % products.length];
}
