# MythRealms US Channel Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the external discovery, analytics, and commerce channels needed to measure a US-only organic launch without spending the reserved operating budget.

**Architecture:** Vercel hosts the canonical storefront. GA4 is the measurement source, Search Console and Merchant Center are Google discovery surfaces, and TikTok/Instagram/Pinterest distribute content. Every profile link uses a stable UTM convention so channel performance can be compared in GA4.

**Tech Stack:** Vercel, GA4, Google Search Console, Google Merchant Center, Meta Business Suite, Pinterest Business, TikTok Business, OpenAI/Perplexity crawler verification.

## Global Constraints

- Complete this plan only after the technical-readiness plan is deployed.
- Never paste access tokens, client secrets, recovery codes, or payment details into repository files or screenshots.
- Use the verified production origin `https://mythrealms.shop`, not a Vercel preview URL.
- Target only the United States. Do not enable international shipping destinations in feeds or campaigns unless fulfillment is ready.
- Do not start paid ads during days 1-60. The reserved 300 RMB remains untouched until the strategy's trigger conditions are met.
- Any platform action requiring account authorization remains a user-approved manual action.

---

### Task 1: Establish the URL and UTM contract

**Output:** A private operator note and the four production links used everywhere.

- [ ] **Step 1: Confirm canonical production behavior**

Open each URL and verify a successful response with no preview-domain redirect:

```text
https://mythrealms.shop/
https://mythrealms.shop/collections/pearl-series
https://mythrealms.shop/sitemap.xml
https://mythrealms.shop/api/feed
```

- [ ] **Step 2: Adopt one UTM naming convention**

Use lowercase ASCII values:

```text
utm_source=tiktok|instagram|pinterest
utm_medium=organic_social
utm_campaign=us_cold_start_2026q3
utm_content=<product>_<concept>_<hook-version>
```

Example:

```text
https://mythrealms.shop/products/new-series-purple-gem-pearl-drops?utm_source=tiktok&utm_medium=organic_social&utm_campaign=us_cold_start_2026q3&utm_content=violet_rain_macro_a
```

- [ ] **Step 3: Create one stable bio link per channel**

Use the Pearl Edit collection for the profile bio and direct product URLs for individual posts. Do not use an external link-in-bio tool during cold start.

---

### Task 2: Configure GA4 and production IDs in Vercel

**Outputs:** GA4 web stream, production environment variables, verified DebugView events.

- [ ] **Step 1: Create or confirm the GA4 web data stream**

Use website URL `https://mythrealms.shop`, stream name `MythRealms US Store`, and record the `G-...` measurement ID privately.

- [ ] **Step 2: Add production environment variables in Vercel**

In Project Settings -> Environment Variables, add only the IDs that exist:

```text
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_META_PIXEL_ID=...
NEXT_PUBLIC_PINTEREST_TAG_ID=...
```

Scope them to Production. Trigger a new deployment because public variables are compiled into the client bundle.

- [ ] **Step 3: Validate GA4 events**

In GA4 DebugView or Realtime, accept cookies and perform:

```text
product view -> add to cart -> checkout -> paid test order
```

Confirm `view_item`, `add_to_cart`, `begin_checkout`, and `purchase`. Confirm currency `USD`, correct item IDs, and one purchase for the order ID.

- [ ] **Step 4: Create a saved weekly acquisition view**

The report must expose source/medium, campaign, landing page, US users, product views, add-to-carts, checkout starts, purchases, revenue, and conversion rate.

---

### Task 3: Configure Google Search Console

**Outputs:** Verified domain property, accepted sitemap, baseline index record.

- [ ] **Step 1: Verify the domain property**

Use the existing DNS verification if available. Prefer a domain property for `mythrealms.shop`; do not create a second competing URL-prefix property unless needed for diagnostics.

- [ ] **Step 2: Submit the sitemap**

Submit:

```text
https://mythrealms.shop/sitemap.xml
```

Record submission date and status.

- [ ] **Step 3: Inspect representative URLs**

Inspect the homepage, Pearl Edit collection, all four hero product URLs, the journal archive, and one journal article. Request indexing only after the live URL reports indexable and canonical.

- [ ] **Step 4: Capture the baseline**

Record indexed page count, excluded/noindex count, discovered-not-indexed count, and any structured-data errors. Recheck weekly; do not repeatedly request indexing every day.

---

### Task 4: Configure Google Merchant Center free listings

**Outputs:** US-only store settings, scheduled primary feed, approved-product baseline.

- [ ] **Step 1: Verify business identity and website**

Confirm the displayed business name, domain, customer-service email, return policy, shipping policy, and checkout currency match the live site.

- [ ] **Step 2: Configure US shipping and returns from real fulfillment data**

Use only the delivery range and cost that the chosen cross-border fulfillment route can meet. Do not copy a competitor's policy. Keep destination country to United States.

- [ ] **Step 3: Add the scheduled feed**

Use `https://mythrealms.shop/api/feed` as the primary feed, English language, United States target country, USD currency, daily fetch.

- [ ] **Step 4: Resolve diagnostics by source-of-truth order**

For price, availability, image, shipping, or policy mismatch, fix the storefront/catalog first, then let the feed regenerate. Do not patch values only inside Merchant Center.

- [ ] **Step 5: Record the baseline**

Record total submitted, approved, limited, and disapproved products. The launch can proceed with the four hero products approved even if low-priority SKUs still need non-policy cleanup; policy violations block launch.

---

### Task 5: Configure TikTok for organic US distribution

**Outputs:** Complete profile, commercial-safe publishing settings, channel bio URL.

- [ ] **Step 1: Complete the profile**

Use the exact brand name, a recognizable logo, a short pearl-jewelry category statement, and the TikTok UTM bio link to `/collections/pearl-series`.

- [ ] **Step 2: Establish publishing safety defaults**

For every commercial post:

- Mark the post as promoting the user's own brand where TikTok provides that disclosure.
- Turn on the AI-generated label when realistic AI people or scenes are used.
- Use TikTok Commercial Music Library audio or audio with documented commercial rights.
- Do not reuse Douyin watermarks, unlicensed trending audio, or copyrighted movie footage.

- [ ] **Step 3: Keep early account behavior human-reviewed**

Use scheduled drafts if available, but manually review the final crop, caption, product identity, disclosures, audio rights, and product link before publishing. Do not automate comments, likes, follows, or repetitive posting behavior.

- [ ] **Step 4: Establish moderation rules**

Reply to genuine questions within 24 hours. Hide spam and impersonation. Never answer material, pearl type, delivery, or durability questions beyond verified supplier/fulfillment facts.

---

### Task 6: Configure Instagram and Pinterest reuse channels

**Outputs:** Business profiles, verified links, reusable publishing templates.

- [ ] **Step 1: Instagram**

Connect the Instagram professional account to Meta Business Suite. Add the Instagram UTM collection link. Confirm Meta Pixel Test Events receives PageView and ecommerce events after marketing consent.

- [ ] **Step 2: Pinterest**

Convert or confirm a business account, claim `mythrealms.shop`, create a board named `Pearl Jewelry Styling`, and use the Pinterest UTM collection link in the profile.

- [ ] **Step 3: Pin contract**

Every Pin needs a clean 2:3 image or compatible video, literal product/style title, factual description, direct product or guide URL, and useful alt text. Avoid keyword lists and vague mystical claims.

- [ ] **Step 4: Verify Pinterest Tag**

After marketing consent, confirm page, add-to-cart, and checkout events in Pinterest's tag diagnostic tools.

---

### Task 7: Verify AI-search discoverability

**Outputs:** Crawlability record and source-access check.

- [ ] **Step 1: Inspect robots rules in production**

Confirm `OAI-SearchBot` and `PerplexityBot` can access the homepage, collection, products, journal, policies, and sitemap. Keep private account, checkout, admin, and API routes blocked except the canonical public product feed.

- [ ] **Step 2: Inspect the public facts AI systems can retrieve**

Check the homepage, About, Shipping, Refund, FAQ, product page, and article in a logged-out browser. The same price, availability, shipping, return, and product wording must appear consistently.

- [ ] **Step 3: Treat direct commerce-feed programs as optional**

Apply to OpenAI commerce/product-feed access only if the account is eligible. Keep stable product IDs and use the canonical catalog as the source. Do not build or maintain a separate speculative feed merely to target answer engines.

---

### Task 8: Perform the go-live acceptance review

**Outputs:** Dated launch checklist and pass/fail decision.

- [ ] **Step 1: Run one mobile acceptance journey**

On a real or emulated US mobile viewport:

```text
TikTok UTM URL -> product -> add to cart -> checkout -> paid test -> confirmation
```

- [ ] **Step 2: Confirm the data trail**

Verify the session source, campaign, landing page, four ecommerce events, order ID, USD value, and lack of duplicate purchase events.

- [ ] **Step 3: Confirm discovery surfaces**

Verify sitemap accepted, representative URLs indexable, Merchant feed fetching, four hero products free-listing eligible, and public pages crawlable.

- [ ] **Step 4: Make the launch decision**

Launch organic posting only when all payment, product-truth, analytics, and policy blockers pass. Search indexing and Merchant approval may still be processing, but they must have no unresolved configuration or policy error.

### Completion Criteria

- Production analytics IDs are configured without exposing secrets.
- The complete ecommerce journey is visible in GA4 and configured marketing platforms after consent.
- Search Console accepts the sitemap and representative URLs are indexable.
- Merchant Center fetches the feed and the four hero products have no policy blocker.
- TikTok, Instagram, and Pinterest profiles use channel-specific UTM links and compliant disclosure/audio defaults.
- No ad spend has been activated.
