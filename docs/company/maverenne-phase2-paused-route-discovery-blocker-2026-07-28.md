# Paused pearl-route discovery blocker - 2026-07-28

## Scope

Local source inspection only. This record does not authorize a route, canonical,
redirect, robots, sitemap, navigation, DNS, deployment, or external-account action.

## Verified current source state

| Surface | `/pearls/stories` | `/pearls/symbolism` | Evidence |
| --- | --- | --- | --- |
| Header | Not directly linked | Not directly linked | `src/lib/storefront/navigation.ts`: `HEADER_LINKS` and `HEADER_MENUS` |
| Footer | Linked in the Learn group | Linked in the Learn group | `src/lib/storefront/navigation.ts`: `FOOTER_GROUPS` |
| Sitemap | Included in the static discovery-path list | Included in the static discovery-path list | `src/app/sitemap.ts` |

## Blocker and required decision

The current Phase 2 URL decision register classifies both routes as `blocked` and
requires founder-written reopening plus content, source, and SEO review before a
new public-code candidate. It does not authorize an automatic removal from Footer
or sitemap. This candidate therefore makes no discovery-surface change.

Before any future change, record one explicit decision for each existing URL:

1. retain public discovery while the route remains available; or
2. authorize a separately reviewed discovery change with its route, canonical,
   robots, sitemap, redirect, rollback, and production-validation boundaries.

Until then, the footer and sitemap observations above are a local blocker, not a
claim about deployment, crawling, indexing, traffic, or rankings.
