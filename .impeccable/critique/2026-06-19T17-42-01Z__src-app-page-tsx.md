---
target: src/app/page.tsx
total_score: 20
p0_count: 2
p1_count: 1
timestamp: 2026-06-19T17-42-01Z
slug: src-app-page-tsx
---
# Design Critique: MythRealms Homepage (src/app/page.tsx)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Guardian section has no interactive feedback; carousel lacks progress indicator |
| 2 | Match Between System / Real World | 3/4 | Chinese character pairs ground the brand, but "28 Mansions" is jargon with no cultural bridge |
| 3 | User Control and Freedom | 2/4 | Carousel has pause/arrows, but newsletter has no undo path; announcement dismiss is permanent |
| 4 | Consistency and Standards | 3/4 | CSS variable architecture is excellent; "Wear the Look" breaks from --text variable to raw text-white |
| 5 | Error Prevention | 2/4 | Newsletter validates but homepage product grids show no stock warnings before click-through |
| 6 | Recognition Rather Than Recall | 1/4 | 15+ foreign terms (Kun Peng, Kui, 二十八宿) with zero inline definitions or tooltips |
| 7 | Flexibility and Efficiency | 2/4 | No "skip to section" nav; three sequential product grids with no jump-links between them |
| 8 | Aesthetic and Minimalist Design | 2/4 | Dark palette + gold accent is strong, but 9 sections with 3 nearly-identical grids creates content inflation |
| 9 | Error Recovery | 2/4 | Newsletter inline error works; homepage is mostly static so error states are minimal |
| 10 | Help and Documentation | 1/4 | No contextual help anywhere; Guardian section promises matching but isn't interactive |
| **Total** | | **20/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**LLM assessment:** The site avoids the most egregious AI tells (no glassmorphism, no gradient text, no numbered section markers, no hero-metric template). But three structural patterns register as AI scaffolding: identical card grid repeated 3 times with near-identical markup; tiny uppercase tracked eyebrow on 3 sections (Wrist Stories, Find Your Guardian, From the Archives); identical "Shop Now" CTA on all 6 carousel slides with no differentiation by product family.

**Deterministic scan:** Clean — 0 findings. No gradient text, no side-stripe borders, no glassmorphism violations detected. The code is mechanically sound; the issues are compositional.

## Overall Impression

The homepage is a well-crafted dark e-commerce page that hasn't yet become a brand experience. The typography pairing (Cormorant Garamond + Inter) is sophisticated. The CSS variable architecture is clean and semantic. The copywriting — when it appears — is genuinely good. But the page structure inverts the brand promise: "Story Over Product" becomes product grids with no stories between them. The single biggest opportunity is converting the Guardian section from a static grid into an actual interactive matching experience.

## What's Working

1. Typography pairing and CSS architecture — Cormorant Garamond headings + Inter body on near-black surface with warm gold accent. CSS variables well-named and consistently applied. prefers-reduced-motion support correctly implemented.
2. Guardian copywriting is the best brand voice — "For the one who's been underestimated," "For the one rebuilding from ashes," "For the one still standing after everything" deliver the emotional recognition job from PRODUCT.md.
3. ProductImage fallback component generates deterministic dark gradients with watermark letters — graceful degradation the user never notices unless images break.

## Priority Issues

### [P0] The Guardian section is a broken promise
The heading asks "Which Beast Were You Born To Wear?" but delivers a static 2x2 grid of product links. No quiz, no matching, no personalization. This is the single highest-leverage conversion point and it's a bait-and-switch.
**Fix:** Replace with a lightweight inline quiz (2-3 questions mapping to a guardian recommendation), or a single compelling CTA to /guardian-quiz.

### [P0] 9 sections, only 3 tell stories
Page structure: Hero -> Trust Bar -> Categories -> 28 Mansions Grid -> Five Elements Grid -> New Arrivals Grid -> Wear the Look -> Newsletter -> Blog. Ratio: 3 storytelling to 5 transactional sections. The long middle (3 consecutive product grids, ~150vh) erodes the emotional peak.
**Fix:** Intersperse myth excerpts before each product grid; collapse to fewer, more differentiated sections.

### [P1] Scroll-reveal animations are defined but unused
globals.css defines .scroll-reveal and .scroll-reveal.visible with a 0.6s fade+translate transition. Not a single section on the homepage uses these classes. The CSS is already written and tested.
**Fix:** Apply scroll-reveal to section containers; add Intersection Observer client hook.

### [P2] Jargon without scaffolding excludes the core audience
15+ foreign terms on the homepage with zero contextual explanation. The target audience includes people curious about Chinese mythology who land from social media — the homepage provides zero on-ramps.
**Fix:** Add inline tooltips, one-line myth tags below product cards, contextual explanations on collection pages.

### [P3] Trust bar duplicates announcement bar
The homepage trust bar and AnnouncementBar both contain "Free Shipping Over $69.99" and "30-Day Returns." The trust bar appears at a critical transition point and should reinforce brand mythology, not repeat logistics.
**Fix:** Replace with a single evocative brand line bridging hero to categories.

## Persona Red Flags

### Jordan (First-Time Browser)
- No "start here" path — 6 carousel slides with identical CTAs, then a flood of products with no curated entry point
- Jargon overload — ~15 foreign terms in 30 seconds, zero explanations

### Casey (Distracted Mobile)
- Carousel touch targets are tiny (pause 16x16px, arrows 32x32px)
- Horizontal category scroll competes with iOS back-swipe gesture
- ProductCard Quick Add button (36x36px) adjacent to full-card link creates mis-tap zone

### Mythology-Curious Browser (Social Media Arrival)
- Zero myth content above the fold on mobile — hero shows product specs, not stories
- No social proof of mythological authenticity — Classic of Mountains and Seas never referenced by Chinese name
- The blog (actual mythology content) is the last section, below 7 non-myth sections

## Minor Observations

- Wishlist heart uses coral-terracotta; warm gold fill would read more "precious"
- Two different dark-overlay approaches for the same visual pattern (from-black/50 vs from-[rgba(15,13,14,0.95)])
- scrollbar-hide on category strip removes scroll position indicators on mobile
- Footer column headers use same tiny-serif-uppercase-tracked pattern — 4th instance, tipping into reflex
- Stock urgency badge with animate-pulse red dot violates Quiet Luxury principle
- Carousel preloads only one adjacent image — backward navigation always cold

## Questions to Consider

1. What if the homepage had only 4 sections? Would that convert better than 9?
2. Why does the Guardian quiz live at /guardian-quiz instead of being the homepage hero?
3. Is the dark palette doing emotional work or is it cosmetic — does it feel "ancient" or just "premium dark mode"?
