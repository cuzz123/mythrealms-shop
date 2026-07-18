import type { StorePolicyFacts } from "@/lib/storefront/policies";

const SCHEMA_CONTEXT = "https://schema.org";
const BRAND_NAME = "MythRealms";
const EDITORIAL_AUTHOR = "MythRealms Editorial";

type VerifiedSchemaObject = Readonly<Record<string, unknown>>;

export type ArticleSchemaInput = Readonly<{
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
}>;

export type AboutPageSchemaInput = Readonly<{
  name: string;
  description: string;
  url: string;
}>;

export type CollectionSchemaInput = Readonly<{
  name: string;
  description: string;
  url: string;
  products: readonly Readonly<{ name: string; url: string }>[];
}>;

export type ProductSchemaInput = Readonly<{
  name: string;
  description: string;
  images: readonly string[];
  price: number;
  currency?: string;
  sku?: string;
  availability: "InStock" | "OutOfStock";
  url: string;
  brand?: string;
  category?: string;
}>;

export type BreadcrumbItem = Readonly<{
  name: string;
  url: string;
}>;

export type FAQItem = Readonly<{
  question: string;
  answer: string;
}>;

export type OrganizationSchemaInput = Readonly<{
  url: string;
  logo: string;
  contactEmail: string;
  description?: string;
  knowsAbout?: readonly string[];
  sameAs?: readonly string[];
  policyFacts?: StorePolicyFacts;
  shippingService?: VerifiedSchemaObject;
  returnPolicy?: VerifiedSchemaObject;
}>;

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    url: input.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    author: {
      "@type": "Organization",
      name: EDITORIAL_AUTHOR,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
    },
  } as const;
}

export function buildAboutPageSchema(input: AboutPageSchemaInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "AboutPage",
    name: input.name,
    description: input.description,
    url: input.url,
  } as const;
}

export function buildCollectionSchema(input: CollectionSchemaInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.products.length,
      itemListElement: input.products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: product.url,
      })),
    },
  } as const;
}

export function buildProductSchema(input: ProductSchemaInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Product",
    name: input.name,
    description: input.description.slice(0, 500),
    image: input.images.filter(Boolean),
    ...(input.sku ? { sku: input.sku } : {}),
    brand: {
      "@type": "Brand",
      name: input.brand ?? BRAND_NAME,
    },
    ...(input.category ? { category: input.category } : {}),
    offers: {
      "@type": "Offer",
      url: input.url,
      priceCurrency: input.currency ?? "USD",
      price: input.price.toFixed(2),
      ...(input.availability
        ? { availability: `https://schema.org/${input.availability}` }
        : {}),
      itemCondition: "https://schema.org/NewCondition",
    },
  } as const;
}

export function buildBreadcrumbListSchema(items: readonly BreadcrumbItem[]) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } as const;
}

export function buildFAQPageSchema(items: readonly FAQItem[]) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  } as const;
}

export function buildOrganizationSchema(input: OrganizationSchemaInput) {
  const baseUrl = input.url.replace(/\/+$/, "");
  const shippingService = input.policyFacts
    ? {
        "@type": "ShippingService",
        name: "MythRealms Standard Shipping",
        url: `${baseUrl}/shipping`,
        description: `${input.policyFacts.handlingBusinessDays.min}-${input.policyFacts.handlingBusinessDays.max} business-day handling, ${input.policyFacts.usStandardTransitBusinessDays.min}-${input.policyFacts.usStandardTransitBusinessDays.max} business-day US standard transit, and free shipping on orders over $${input.policyFacts.freeShippingThresholdUsd.toFixed(2)}.`,
      }
    : input.shippingService;
  const returnPolicy = input.policyFacts
    ? {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: input.policyFacts.returnWindowDays,
        returnMethod: input.policyFacts.returnMethod,
        returnFees: input.policyFacts.defaultReturnFees,
        merchantReturnLink: `${baseUrl}/refund`,
      }
    : input.returnPolicy;

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": ["Organization", "OnlineStore"],
    name: BRAND_NAME,
    url: input.url,
    logo: input.logo,
    ...(input.description ? { description: input.description } : {}),
    ...(input.knowsAbout ? { knowsAbout: [...input.knowsAbout] } : {}),
    ...(input.sameAs ? { sameAs: [...input.sameAs] } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      email: input.contactEmail,
      contactType: "customer service",
      url: `${baseUrl}/contact`,
    },
    ...(shippingService
      ? { hasShippingService: { ...shippingService } }
      : {}),
    ...(returnPolicy
      ? { hasMerchantReturnPolicy: { ...returnPolicy } }
      : {}),
  } as const;
}
