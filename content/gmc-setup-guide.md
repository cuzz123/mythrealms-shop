# Google Merchant Center Setup Guide for MythRealms

## Step 1: Create Account
1. Go to https://merchants.google.com
2. Sign in with your Google account
3. Click "Create Merchant Center account"
4. Fill in:
   - Business name: MythRealms
   - Country: United States
   - Time zone: Eastern Time

## Step 2: Configure Product Feed
1. Left menu → Products → Feeds
2. Click "+" Add feed
3. Choose "Primary feed"
4. Set:
   - Target country: United States
   - Language: English
   - Feed name: MythRealms Products
   - Input method: Scheduled fetch
   - Feed URL: `https://mythrealms-shop.vercel.app/api/feed/google`
   - Fetch frequency: Daily
5. Click "Create feed"

## Step 3: Verify Website
1. Settings → Business information → Website
2. Enter: `https://mythrealms-shop.vercel.app`
3. Choose verification method:
   - Easiest: Add an HTML tag to your site (I'll add this to layout.tsx)
   - Alternative: Upload HTML file to public/

## Step 4: Shipping Settings
1. Settings → Shipping and returns
2. Set up:
   - Free shipping over $69.99 (US)
   - Standard shipping: $4.99
   - Processing time: 2-3 weeks (handcrafted)

## Step 5: Tax Settings
1. Settings → Sales tax
2. Configure based on your business structure

## Step 6: Link Google Ads (Optional)
1. Settings → Linked accounts → Google Ads
2. Link for Performance Max campaigns

## Feed URL
```
https://mythrealms-shop.vercel.app/api/feed/google
```

## Notes
- The feed auto-updates daily (fetched by Google)
- New products appear automatically
- Out-of-stock products are marked as "out_of_stock"
- Prices come from the lowest variant price
