# Cold Start Measurement Runbook

Production verification for the US cold-start tracking stack (GA4, Meta Pixel, and Pinterest Tag)
on `https://mythrealms.shop`. Run after `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, and
`NEXT_PUBLIC_PINTEREST_TAG_ID` are set in Vercel. Record every run in
[Section 7](#7-production-test-record) **before** publishing any organic campaign links.

**Tools:** GA4 DebugView (Admin -> DebugView) and Realtime, Meta Events Manager -> Test Events,
Pinterest Tag Helper, and the browser DevTools Network tab.
**Source of truth for payloads:** `src/lib/tracking.ts`.

## 1. UTM convention

Use lowercase ASCII values and underscores between words. Include exactly these four parameters:

```text
utm_source=tiktok|instagram|pinterest
utm_medium=organic_social
utm_campaign=us_cold_start_2026q3
utm_content=<product>_<concept>_<hook-version>
```

## 2. Production test URLs

Use one URL per hero product. The examples exercise all three organic sources.

```text
https://mythrealms.shop/products/new-series-purple-gem-pearl-drops?utm_source=tiktok&utm_medium=organic_social&utm_campaign=us_cold_start_2026q3&utm_content=violet_rain_runbook_a
https://mythrealms.shop/products/new-series-round-shell-disc-drops?utm_source=instagram&utm_medium=organic_social&utm_campaign=us_cold_start_2026q3&utm_content=moon_disc_runbook_a
https://mythrealms.shop/products/new-series-leaf-turquoise-pearl-cuff?utm_source=pinterest&utm_medium=organic_social&utm_campaign=us_cold_start_2026q3&utm_content=turquoise_leaf_runbook_a
https://mythrealms.shop/products/new-series-pearl-y-lariat?utm_source=tiktok&utm_medium=organic_social&utm_campaign=us_cold_start_2026q3&utm_content=falling_pearl_runbook_a
```

## 3. Expected events and fields

All monetary values use USD. `id` below is the product ID, such as `new-series-004`, not the slug.

### GA4 (`gtag`; analytics consent required)

| Event | Expected fields |
| --- | --- |
| `view_item` | `currency: "USD"`, `value` = unit price, `items[0]`: `item_id`, `item_name`, `price`; optional `item_category` and `item_variant` only when set |
| `add_to_cart` | `currency`, `value` = price x quantity, `items[0]` as above plus `quantity` |
| `begin_checkout` | `currency`, `value` = cart total, `items[]` each with `item_id`, `item_name`, `price`, `quantity` |
| `purchase` | `transaction_id` = order ID, `currency`, `value` = order total, `items[]` as in `begin_checkout` |

### Meta Pixel (`fbq`; marketing consent required)

| GA4 event | Meta event | Expected fields |
| --- | --- | --- |
| `view_item` | `ViewContent` | `content_ids: [id]`, `content_name`, `content_type: "product"`, `currency`, `value` = unit price |
| `add_to_cart` | `AddToCart` | same shape; `value` = price x quantity |
| `begin_checkout` | `InitiateCheckout` | `content_ids`, `content_type: "product"`, `contents[]` (`id`, `item_price`, `quantity`), `currency`, `num_items`, `value` |
| `purchase` | `Purchase` | same fields as `InitiateCheckout`; no transaction ID is sent, so dedupe is client-side (Section 6) |

### Pinterest Tag (`pintrk`; marketing consent required)

| GA4 event | Pinterest event | Expected fields |
| --- | --- | --- |
| `view_item` | `pagevisit` | `currency`, `value`, `product_id`, `product_name` |
| `add_to_cart` | `addtocart` | same shape plus `order_quantity` |
| `begin_checkout` | `checkout` | `currency`, `value`, `product_id: [ids]`, `order_quantity`; no `order_id` |
| `purchase` | `checkout` | same fields plus `order_id`; its presence distinguishes purchase from begin checkout |

## 4. Consent checks

Consent is stored in `localStorage["cookie-consent"]`. Granting consent takes effect on the same
page without a reload. Revoking an already granted category reloads the page to remove loaded tags.
GA4 requires `analytics: true`; Meta and Pinterest require `marketing: true`.

**Essential-only (expect zero events):**

1. Open hero URL #1 in a fresh incognito window and click **Essential Only**.
2. View the product, add it to the cart, open the cart, and start checkout.
3. In DevTools Network, confirm there are no requests to `google-analytics.com/g/collect`,
   `facebook.com/tr`, or `ct.pinterest.com`. GA4 DebugView must remain empty.

**Accepted (expect configured-platform events):**

1. Open hero URL #2 in a new incognito window and click **Accept All**.
2. Repeat the interactions and confirm every event in Section 3 appears in the configured platform
   tools with the listed fields. A platform without a production ID is expected to remain absent.

## 5. Full-funnel production test

1. With **Accept All**, open each URL in Section 2. Confirm one `view_item` per product with the correct `item_id` and `value`.
2. Add one hero product to the cart. Confirm `add_to_cart`, `AddToCart`, and `addtocart` on configured platforms.
3. Start checkout. Confirm `begin_checkout`, `InitiateCheckout`, and Pinterest `checkout` without `order_id`.
4. Only after explicit operator approval, complete one real low-value order. On `/checkout/success`, the GA4 `purchase`, Meta `Purchase`, and Pinterest `checkout` with `order_id` must fire exactly once; GA4 `transaction_id` must equal the order ID. Without approval, record this check as pending rather than creating a charge.
5. In GA4 Realtime -> Traffic acquisition, confirm the session carries the exact `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` from the test link.

## 6. Purchase refresh dedupe

1. On `/checkout/success`, confirm `localStorage["mythrealms:purchase-tracked:<orderId>"]` is `"true"`.
2. Refresh the success page 2-3 times. Confirm there are no additional purchase hits in DevTools Network or any configured platform debugger.
3. Test late consent: when consent is granted after landing on the success page, purchase must fire once on the consent change and then dedupe as above.

## 7. Production test record

Use `pass`, `fail: <reason>`, or `pending: <reason>` in Result.

| Test date | Tester | Order ID | Result |
| --- | --- | --- | --- |
| 2026-07-19 | Codex | N/A | pending: `mythrealms.shop` is not attached to the Vercel project; analytics platform IDs are not configured; no live-money test was authorized |
|  |  |  |  |
|  |  |  |  |
