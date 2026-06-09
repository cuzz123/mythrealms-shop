# MythRealms Meta Ads Setup Guide

## Prerequisites
- Meta Business Suite account (facebook.com/business)
- Meta Pixel installed (already done: 4414491088773455)
- Product catalog ready (73 products)

## Step 1: Create Product Catalog
1. Meta Business Suite → Commerce Manager → Add Catalog
2. Type: E-commerce
3. Name: MythRealms Products
4. Upload method: Connect data source → Website crawled
5. URL: `https://mythrealms-shop.vercel.app`

## Step 2: Create Campaigns (Start at $10/day per campaign)

### Campaign 1: Traffic — Guardian Quiz
- Objective: Traffic
- Budget: $10/day
- Target: Women 25-45, US/UK/CA/AU
- Interests: Chinese mythology, fantasy jewelry, crystals, astrology, tarot, Wicca
- Ad: "Which ancient Chinese guardian protects YOUR soul? Take the 3-question quiz."
- Landing page: `/guardian-quiz`
- Schedule: Run continuously, review after 7 days

### Campaign 2: Conversions — Retargeting
- Objective: Sales
- Budget: $10/day
- Audience: Website visitors (last 30 days), Viewed product, Added to cart
- Ad: Product carousel showing 5 best sellers + MYTH15 discount code
- Landing page: Respective product pages
- Schedule: Start after Campaign 1 has generated 500+ visitors

## Step 3: Ad Creative Specs

### Image Ads
- Format: 1080x1080 (1:1) for Feed, 1080x1920 (9:16) for Stories
- Use luxury product photos from `/images/products/`
- Text overlay: Keep to max 20% of image
- CTA buttons: "Shop Now" or "Learn More"

### Carousel Ads
- 3-5 product images with individual links
- Card 1: Best-seller hero shot
- Card 2: Close-up detail shot
- Card 3: Lifestyle/styled shot
- Card 4: Collection shot
- Card 5: Guardian Quiz CTA

## Step 4: Key Numbers to Watch

| Metric | Target |
|--------|--------|
| CTR (Click-through rate) | >1.5% |
| CPC (Cost per click) | <$0.50 |
| CPM (Cost per 1000 impressions) | <$15 |
| ROAS (Return on ad spend) | >2x (breakeven) |

## Budget Plan (Month 1)

| Week | Campaign | Budget | Cumulative |
|------|----------|--------|------------|
| 1 | Quiz Traffic | $10/day | $70 |
| 2 | Quiz Traffic | $10/day | $140 |
| 3 | Quiz + Retargeting | $20/day | $280 |
| 4 | Quiz + Retargeting | $20/day | $420 |

Total Month 1: ~$420. This is the minimum viable test budget.
