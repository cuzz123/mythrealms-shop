# Phase 2 C lint: set-state-in-effect behavior contracts

**Status:** design only — no application source or test code is changed by this record.
**Scope:** the ten `react-hooks/set-state-in-effect` errors reproduced from the Phase 2 lockfile dependency tree at commit `60ddf62398455240a15c847fb8ccc20a416bfe3c`.

## Reproduction and design rule

Reproduce with:

```powershell
node node_modules/eslint/bin/eslint.js . -f json
```

At the time of this record it reports ten errors, all `react-hooks/set-state-in-effect`. The rule rejects synchronous state updates in an effect body, including an effect that immediately invokes an async function which begins by setting state.

Any implementation must first add the listed behavior test, observe it fail against the intended replacement, then make one minimal source change. A lint-clean implementation is insufficient if it changes the stated visible contract.

## Classification summary

| Classification | Items | Reason |
| --- | --- | --- |
| Can repair with no behavior change | SearchOverlay result list | Results are a pure deterministic function of the input query and static storefront catalog. |
| Possibly behavior-changing; one product decision required | Account, SocialTasks, Checkout ×2, PayPalButton, OperationsHub, PinterestDraftQueue, Header ×2, RecentlyViewed | Each has asynchronous data/loading/error state, browser-only persisted state, or scroll/focus timing. The current behavior must be chosen and tested before a replacement is authorized. |
| Can remove dead state | None confirmed | The checkout clear may look dead while the cart is empty, but it prevents stale discount preview state when items return; do not remove it without a test. |

## Per-item contracts

| File and lint location | Current trigger and visible contract | Existing coverage | Suggested replacement model | Expected failing test before implementation | Can guarantee unchanged behavior? | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| `src/app/account/page.tsx:40` | When session becomes `authenticated`, immediately display the order-history loading skeleton, clear its prior error, request orders and loyalty points, then show orders/error and hide loading. No request while unauthenticated/loading. | No account-page behavior test found. | Extract an explicit account-resource state machine or a tested query/resource hook; loading begins on the authentication transition, with cancellation/stale-response handling. | Authenticate a rendered account page; assert one orders request, loading before resolution, then orders/error after resolution; assert logout or stale response cannot replace a later session. | No — loading/error timing and stale response behavior need an explicit contract. | Possible behavior change. |
| `src/app/admin/social-tasks/page.tsx:92` | On client mount, restore `completed` and `expanded` from localStorage; thereafter save both values after user actions. Initial server/client render currently starts empty, then paints persisted state. | No direct test found. | Browser-storage adapter using `useSyncExternalStore` (server snapshot empty) or a deliberately tested hydration gate. | Seed both localStorage keys; mount/hydrate; assert persisted tasks and category expansion appear, malformed/missing JSON remains safe, and no initial write erases stored data. | No — hydration timing and first paint must be selected. | Possible behavior change. |
| `src/app/checkout/page.tsx:155` | On cart-content key change: revalidate an existing discount; when cart becomes empty, clear preview state. Empty-cart UI returns before totals are shown. | `tests/discount-preview.test.ts` and `tests/paypal-only-checkout.test.ts` protect request shape and stale-state clearing on request failures, not the empty-cart transition. | Model discount preview as cart-keyed derived/request state; retain the explicit empty-cart invalidation rule until a transition test proves it unnecessary. | Apply a valid preview, empty cart, then add items again; assert no stale label/amount is shown before the new validation settles. | No — removal or deferral can flash a stale discount. | Possible behavior change. |
| `src/app/checkout/page.tsx:737` | After PayPal SDK readiness, if the button container/SDK is absent, immediately surface the existing PayPal unavailable error; otherwise SDK lifecycle updates readiness/error state through observer, promise, and timeout callbacks. | `tests/paypal-only-checkout.test.ts` covers SDK markup/lifecycle source contracts, not rendered error timing. | Treat SDK availability as an external subscription/resource and expose a tested status; preserve timeout, render failure, and unavailable states. | Simulate SDK-ready with missing container/Buttons; assert the unavailable alert becomes visible and payment cannot proceed; separately assert render success/error/timeout states. | No — error visibility and payment affordance timing are customer-facing. | Possible behavior change. |
| `src/components/admin/OperationsHub.tsx:107` | On mount, call `refresh`, set busy, fetch candidates/inbox/reports in parallel, update successful datasets, show message on failure, and clear busy. User actions also call the same refresh. | No direct component test found. | A tested admin data resource with explicit initial-load and manual-refresh states; preserve partial-success behavior. | Mount with controlled three responses; assert busy while pending, successful endpoints update independently, a failure message appears, and manual refresh keeps the same semantics. | No — busy indicator, partial success, and failure timing are visible to admins. | Possible behavior change. |
| `src/components/admin/PinterestDraftQueue.tsx:124` | On mount, call `loadDrafts`, set loading, fetch drafts, derive edits, show notice on failure, then clear loading. Later create/action flows update the same state. | No direct component test found. | A tested draft-queue resource that atomically supplies drafts plus derived edits, with initial-load and refresh states. | Mount with successful/failed fetches; assert loading, ordered drafts and edits after success, notice after failure, and a later create/action does not overwrite edits incorrectly. | No — loading, notice, and draft/edit synchronization are visible. | Possible behavior change. |
| `src/components/layout/Header.tsx:59` | On non-home routes force solid/scrolled header; on home install a scroll listener and immediately calculate overlay versus solid from current scroll position. | No direct header test found. | Separate route-derived `isScrolled = !isHome || homeScrollPastThreshold` from a scroll subscription; define the initial client snapshot deliberately. | At home above/below threshold and on a non-home route, assert header class/contrast; navigate home ↔ non-home and assert no overlay flash or incorrect threshold state. | No — initial scroll restoration and route transition appearance are customer-visible. | Possible behavior change. |
| `src/components/layout/Header.tsx:95` | When a desktop menu was opened with pending focus, focus its first menuitem once and clear the pending marker. | No direct focus test found. | Move focus scheduling to the explicit open-menu event or a tested callback/ref lifecycle; retain outside-click and route-change close behavior. | Open each desktop menu by keyboard; assert focus reaches first menuitem once, Escape/outside click returns focus correctly, and route change closes menu without stale focus. | No — focus order is an accessibility-visible interaction contract. | Possible behavior change. |
| `src/components/layout/SearchOverlay.tsx:58` | Query shorter than two trimmed characters has no results; otherwise list is the first eight matching storefront products. Results are never independently edited. | `tests/public-catalog.test.ts` and `tests/storefront-trust.test.ts` cover catalog boundary and prompt copy, not query-result behavior. | Replace `results` state/effect with `useMemo` derived from `query` and `getStorefrontProducts()`. | Query 0/1 trimmed characters → empty; query ≥2 → matching catalog products, max eight; changing query cannot show results from the prior query. | Yes — given the catalog accessor is synchronous and results have no independent mutation. | No behavior change. |
| `src/components/ui/RecentlyViewed.tsx:18` | On client mount, load up to four localStorage slugs, map only catalog products, and render nothing if none resolve. Server/first client render begins empty. | `tests/public-catalog.test.ts` only protects catalog boundary. | Browser-storage adapter using `useSyncExternalStore` or a tested hydration gate, preserving malformed JSON handling and four-item limit. | Seed valid, missing, and malformed localStorage values; assert valid four-product display, missing/malformed null render, and hydration does not throw or expose unsupported products. | No — the chosen client snapshot determines first-paint and hydration behavior. | Possible behavior change. |

## Single product decision package

Before C implementation, approve one product-level statement rather than ten ad hoc choices:

> Preserve the current post-hydration user-visible behavior for authenticated/admin loading, browser-storage restoration, discount invalidation, PayPal error display, header route/scroll/focus transitions, and recently-viewed rendering. Where browser/server first-paint behavior is presently implicit, define the expected first paint in the behavior tests before changing state ownership.

This decision does **not** authorize deployment, changes to customer-facing copy, product state, payment behavior, external accounts, or production data access. It only authorizes test-first replacement of the listed local state models after the expected visible behavior is selected.

## Safe implementation order after approval

1. SearchOverlay: add the pure-query behavior test, observe RED against the intended derived model, then make the isolated `useMemo` change.
2. Header focus and route/scroll: add interaction tests before selecting a state/subscription model.
3. Browser-storage pair: add hydration tests before selecting `useSyncExternalStore` or a gate.
4. Checkout and PayPal: add transition/error tests before changing payment or discount state.
5. Account and admin resources: add controlled async-loading tests, then change one resource at a time.

After each item: target test, target lint, typecheck, then full lint. C is complete only when full lint reports zero errors; existing warnings remain separately tracked.
