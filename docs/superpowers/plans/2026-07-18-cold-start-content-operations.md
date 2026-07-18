# MythRealms 90-Day Content Operations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and operate a US-facing, AI-assisted organic content system that can generate 10-20 paid orders in 90 days while protecting product truth and the remaining 2,000 RMB operating budget.

**Architecture:** TikTok is the testing surface, Instagram Reels reuses proven video, Pinterest compounds product/style discovery, and the journal turns validated questions into searchable assets. Four visually distinct products form the first test matrix; behavior data chooses the eventual hero SKU.

**Tech Stack:** Existing image-generation tools, Seedance 2.0, TikTok, Instagram Reels, Pinterest, GA4, existing MythRealms video-pipeline assets.

## Global Constraints

- US audience only; English public copy.
- No new AI subscription during the 90-day test.
- Do not buy samples during initial validation, but obtain supplier image permission before publishing supplier photos.
- Never change product shape, color, scale, pearl count, stone layout, connector, chain geometry, or accessory structure in AI output.
- Do not claim freshwater/saltwater pearl, precious-metal purity, handmade process, origin, durability, waterproofing, healing effect, or scarcity without documentation.
- Do not fabricate reviews, orders, before/after evidence, customer videos, or unboxing.
- Use AI and commercial-content disclosures where required, and commercial-safe audio only.
- Every post receives a human review before publishing. Automation may prepare drafts and reports, not perform engagement spam.
- Budget reserve: 1,100 RMB fulfillment float, 400 RMB refund/replacement reserve, 300 RMB conditional retargeting, 100 RMB essential assets, 100 RMB contingency.

---

### Task 1: Lock the four-product test set and source-of-truth packs

**Outputs:** Four approved product packs and one product-fact sheet per SKU.

Use these existing products and landing pages:

| Working name | Product slug | Initial role | Existing shot package |
| --- | --- | --- | --- |
| Violet Rain | `new-series-purple-gem-pearl-drops` | Dramatic color / statement earring | `SHOT_VIOLET_RAIN_COLD_START_001` |
| Moon Disc | `new-series-round-shell-disc-drops` | Movement / iridescence | `SHOT_MOON_DISC_COLD_START_001` |
| Turquoise Leaf | `new-series-leaf-turquoise-pearl-cuff` | Wrist styling / color | `SHOT_TURQUOISE_LEAF_COLD_START_001` |
| Falling Pearl | `new-series-pearl-y-lariat` | Minimal necklace / evening styling | `SHOT_FALLING_PEARL_COLD_START_001` |

- [ ] **Step 1: Create a fact sheet for each product**

Record only supplier-supported values: source image paths, visible components, selling price, product dimensions if verified, available variants, stock handling, fulfillment cost estimate, delivery estimate, and return constraints.

- [ ] **Step 2: Obtain and record supplier image permission**

Store the date, supplier contact, permission scope, and source URL privately. A missing response is not permission.

- [ ] **Step 3: Validate every landing page against the supplier gallery**

Check product name, price, photos, description, in-stock state, shipping wording, return wording, and mobile checkout. Pause any SKU whose actual fulfillment data cannot support the page.

- [ ] **Step 4: Complete the existing four shot packages**

Execute `docs/superpowers/plans/2026-07-17-four-product-tiktok-first-frame-batch.md`. Inspect every generated frame at full resolution and reject identity drift before Seedance generation.

---

### Task 2: Build six repeatable content formats

**Outputs:** Six templates, each with two hook variants and one direct landing page.

Use this launch mix:

1. `Macro proof`: product detail in frame 1, movement reveals texture.
2. `A/B choice`: two products or two styling moods; asks for a concrete choice.
3. `POV styling`: one situation, one product, one outfit result.
4. `Price/style`: literal price and occasion without competitor comparison.
5. `Trust answer`: shipping, returns, AI imagery, or what the buyer receives.
6. `Brand world`: a 10-15 second fashion vignette that reveals a real product in the first two seconds.

- [ ] **Step 1: Create two hook variants for each format**

The visual first frame changes; the body and CTA stay constant. Examples:

```text
A: The color changes when you move.
B: Watch the shell catch green, then pink.
```

- [ ] **Step 2: Use the single-video structure**

```text
0-2s: product or explicit question
2-6s: occasion, choice, or tension
6-15s: readable product/styling result
last 2s: soft CTA + MythRealms
```

- [ ] **Step 3: Apply the visual QA gate**

Reject a render for product drift, extra jewelry, malformed hands/ears, unreadable product, artificial skin, generated text, impossible motion, frame jitter, watermark, or a crop hidden by platform UI.

- [ ] **Step 4: Apply the copy QA gate**

Every caption must state a real styling idea or question, use at most 3-5 relevant hashtags, avoid luxury-brand imitation language, avoid unsupported materials, and point to the exact product shown.

---

### Task 3: Execute the first 14-day publishing sprint

**Cadence:** TikTok daily, Reels 4 per week, Pinterest 4-6 per week. Publish at 8:00 PM US Eastern Time (5:00 PM Pacific) for the first seven days, then adjust using actual audience analytics.

| Day | TikTok post | On-screen hook | CTA / landing | Reuse |
| ---: | --- | --- | --- | --- |
| 1 | Moon Disc macro movement | `The color changes when you move.` | `See the full pair in bio.` Direct Moon Disc URL in post/profile where available | Reel D2; Pin macro still |
| 2 | Violet Rain wearing profile | `Pearls, but after midnight.` | `Would you wear these: yes or no?` Product URL | Pin profile still |
| 3 | A/B: Moon Disc vs Violet Rain | `Silver light or violet light?` | `Comment A or B.` Pearl Edit collection | Reel same day |
| 4 | Falling Pearl neckline reveal | `One line. One falling pearl.` | `See how it sits.` Product URL | Pin full-product still |
| 5 | Trust: AI scene vs product reference | `The scene is AI. The product details are checked against supplier views.` | `Supplier views appear first on the product page.` Product URL | Reel; no sales pressure |
| 6 | Turquoise Leaf sleeve reveal | `Made for sunlit skin.` | `Save this for summer styling.` Product URL | Pin wrist crop |
| 7 | POV outfit result, Violet Rain | `POV: your black dress needed one thing.` | `The Violet Rain pair is linked.` Product URL | Reel D8 |
| 8 | Recut best D1-D7 opening with faster reveal | Use winning hook, change first frame only | Same landing as winner | Pin winner frame |
| 9 | Price/style, best earring | `$39-$59 pearl styling for an evening look.` Use actual product price on publish day | `See today's price on the product page.` | Reel |
| 10 | A/B: Turquoise Leaf vs Falling Pearl | `Wrist detail or neckline detail?` | `Comment wrist or necklace.` Collection URL | Two Pins |
| 11 | Moon Disc product-only movement | `No outfit. Just the color shift.` | `Save for your next dinner look.` Product URL | Reel D12 |
| 12 | Trust: US delivery process | `What happens after you order from MythRealms?` | State only verified handling and delivery windows; link Shipping page | Policy Pin |
| 13 | Violet Rain pair proof | `Would you style these with black or ivory?` | `Comment black or ivory.` Product URL | Reel |
| 14 | Four-product rapid choice | `Pick one: 1, 2, 3, or 4.` | `The Pearl Edit is in bio.` Collection URL | Pinterest four-tile collage only if each product remains exact |

- [ ] **Step 1: Prepare each post 24 hours before publication**

Record filename, product, concept, hook version, caption, disclosure, audio source, CTA URL, and UTM content value.

- [ ] **Step 2: Use direct English captions**

Caption patterns:

```text
Pearls, but after midnight. Would you wear the Violet Rain pair with black or ivory? AI-created scene; product reference views are on the product page. #pearljewelry #earringstyle #eveningstyle
```

```text
The shell shifts from green to pink as it moves. Save this for your next dinner look. #pearlearrings #jewelrystyling #outfitdetails
```

- [ ] **Step 3: Pin a useful first comment**

Use the exact product name and link direction, not a generic slogan:

```text
Product: The Moon Disc. Supplier-reference views appear first on the product page; link in bio.
```

- [ ] **Step 4: Record 2-hour and 24-hour results**

Capture views, average watch time, completion rate, likes, saves, comments, profile visits, link clicks, US sessions, product views, add-to-carts, and orders. Do not delete a low-view post during the first 24 hours unless it contains an error or policy risk.

---

### Task 4: Run the weekly content production loop

**Output:** One approved seven-day queue and one Friday decision record each week.

- [ ] **Monday: choose evidence-backed briefs**

Select 7 TikTok briefs from last week's top two hooks, top two products by qualified product-page visits/add-to-carts, one unanswered comment, and one new controlled test.

- [ ] **Tuesday: create first frames and product stills**

Generate only the assets required by the seven briefs. Review product identity before paying for video generation.

- [ ] **Wednesday: generate video variants**

Use Seedance in short segments. Change one variable per test: first frame, hook text, scene, or CTA. Do not change all variables in one comparison.

- [ ] **Thursday: edit and compliance review**

Add readable captions inside platform safe areas, commercial-safe audio, disclosure, exact CTA, and UTM link. Export clean masters without platform watermarks.

- [ ] **Friday: schedule and review data**

Schedule drafts, then review the previous seven days. Record keep/iterate/stop for every concept and product.

- [ ] **Weekend: engage and capture questions**

Reply manually to product questions and turn repeated questions into next week's trust video or journal brief.

---

### Task 5: Apply the 90-day phase rules

#### Days 1-14: establish a baseline

- [ ] Publish 14 TikToks, 8 Reels, and 8-12 Pins.
- [ ] Test six concepts with two openings each.
- [ ] Success signal: one post over 1,000 views or at least 10 profile/site visits.
- [ ] If neither occurs, keep cadence flat and improve first-two-second product visibility.

#### Days 15-35: find the hook/product pair

- [ ] Stop the bottom 50% of concepts by qualified traffic, not likes alone.
- [ ] Make three variants of each of the top two hooks.
- [ ] Reduce brand films to one per week.
- [ ] Publish one high-intent journal article per week.
- [ ] Target 100-250 cumulative qualified US visits, 5-10 subscribers, 3+ add-to-carts, and the first 1-3 orders.

#### Days 36-60: concentrate around one candidate hero SKU

- [ ] Choose the hero by product-page visits, add-to-cart rate, checkout starts, refund risk, and unit economics.
- [ ] Allocate content 60% hero, 20% companion/entry product, 20% new tests.
- [ ] Target 300-500 cumulative qualified visits, 8-15 add-to-carts, and 4-8 cumulative orders.

#### Days 61-90: replicate verified signals

- [ ] Build a `3 hooks x 2 visual treatments x 2 CTAs = 12 asset` matrix around the winner.
- [ ] Repurpose winners into Reels, Pins, article lead media, and product-page video.
- [ ] End target: 70-90 TikToks, 35-45 Reels, 45-60 Pins, 8-10 journal/guidance pages, 700-1,500 qualified US visits, and 10-20 paid orders.

---

### Task 6: Turn validated audience questions into SEO/GEO content

**Output:** One article per week from days 15-90, each tied to a measured question and real products.

Publish in this priority order unless social comments reveal stronger demand:

1. `Pearl Earrings Under $50: A Styling Guide`
2. `What to Wear with Statement Pearl Earrings`
3. `Pearl Necklace Length Guide`
4. `Pearl Jewelry Gift Guide for Her`
5. `How to Care for Pearl and Shell Jewelry`
6. `How Long Does MythRealms Shipping to the US Take?`
7. `How to Style Baroque Pearl Earrings for an Evening Outfit`
8. `Freshwater Pearl vs Mother-of-Pearl: What Buyers Should Know`

- [ ] **Step 1: Verify every factual claim before drafting**

The final topic requires sourced educational distinctions and must not classify a MythRealms product without supplier proof.

- [ ] **Step 2: Use the answer-first article structure**

```text
direct answer -> suitable buyers/occasions -> decision factors -> product examples -> cautions -> FAQ -> relevant product CTA
```

- [ ] **Step 3: Add internal links and one measurable CTA**

Link to one relevant guide, one policy page where useful, and no more than three directly relevant products. Add UTM tags only to external campaign links, not normal internal links.

- [ ] **Step 4: Review performance after 28 days**

Track impressions, clicks, guide-to-product click-through, add-to-carts, and assisted orders. Refresh only when facts, products, or observed queries justify it.

---

### Task 7: Use the weekly funnel diagnosis rules

**Output:** One explicit action for the next week; never a vague “post more” conclusion.

| Observed result | Diagnosis | Next action |
| --- | --- | --- |
| Low views and low watch time | First frame/hook failure | Make product larger by frame 1; shorten setup; test two new openings |
| Views but no profile visits | Content entertains without product intent | Name the item/occasion earlier; make CTA concrete |
| Profile visits but no site clicks | Bio positioning or link mismatch | Use literal pearl-jewelry bio and collection link; align pinned videos |
| Site clicks but few product views | Landing mismatch or slow/unclear mobile page | Direct-link exact SKU; inspect mobile performance and hero content |
| 100 qualified visits with no subscribe/add-to-cart | Trust, price, image, or shipping problem | Audit product truth, delivery, returns, price, and checkout confidence |
| 300 product views with add-to-cart rate under 2% | Weak product-market offer | Pause the SKU; do not use ads to force it |
| 10 add-to-carts but little checkout | Cart/fees/delivery friction | Inspect shipping cost, delivery promise, discount clarity, and mobile cart |
| 5 checkout starts with no payment | Payment or trust blocker | Test payment on mobile and inspect errors/policy visibility |
| Orders with serious item mismatch | Supplier/AI truth failure | Delist immediately and protect refund reserve |

- [ ] **Step 1: Compare products on qualified metrics**

Use product views, add-to-cart rate, checkout rate, paid conversion, expected gross margin, and service risk. Likes are supporting evidence only.

- [ ] **Step 2: Stop concepts consistently below median**

After four controlled variants remain below the channel median for views and clicks, stop the concept for at least two weeks.

- [ ] **Step 3: Preserve a test log**

For every decision, record date, sample size, winning/losing variable, action, and the earliest date it can be reconsidered.

---

### Task 8: Enforce budget and advertising gates

- [ ] **Step 1: Reconcile cash every week**

Record paid orders, supplier purchase cost, domestic China shipping, inspection/repacking, international shipping, payment fees, refunds/replacements, and available fulfillment float.

- [ ] **Step 2: Keep the 300 RMB ad reserve locked through day 60**

Do not start TikTok Ads. Consider a seven-day Meta retargeting test only after all of these are true:

- At least 300 US sessions in the latest 30 days.
- At least 5 add-to-carts or 1 organic paid order.
- `view_item`, `add_to_cart`, `begin_checkout`, and `purchase` verified.
- One piece of content demonstrably sends product-page visits.
- The hero SKU's maximum allowable acquisition cost is known.

- [ ] **Step 3: Abort an eligible retargeting test when economics fail**

If spend reaches one order's available gross margin without a purchase, pause immediately. If the audience is too small for delivery, do not broaden to cold traffic.

---

### Task 9: Make the day-90 decision

- [ ] **Step 1: Continue only with evidence**

Use these outcomes:

- Fewer than 3 orders after 700+ qualified visits and fewer than 15 add-to-carts: do not add ad spend; reassess product/trust/fulfillment.
- 4-9 orders: keep the winner, buy a real sample, replace uncertain AI details with real content, then run a second validation stage.
- 10-20 orders: buy samples of the hero and companion product, validate quality/fulfillment, build real UGC/product footage, and only then expand paid tests.

- [ ] **Step 2: Archive the losing test assets without deleting evidence**

Mark them inactive in the operating log, preserve their metrics, and avoid quietly recycling failed creative as “new.”

- [ ] **Step 3: Produce a one-page decision memo**

Include orders, revenue, variable fulfillment cost, refunds, qualified US visits, funnel rates, winning product, winning hook, top objection, next budget, and explicit continue/adjust/stop decision.

### Completion Criteria

- Four launch product truth packs are approved and linked to exact landing pages.
- The first 14 days are published and measured without increasing cadence reactively.
- Weekly keep/iterate/stop decisions are based on qualified funnel metrics.
- 8-10 useful journal/guidance pages are produced from validated questions.
- The remaining 2,000 RMB stays inside the agreed envelopes.
- At day 90, the project either reaches 10-20 real paid orders or produces a clear evidence-based stop/adjust decision.
