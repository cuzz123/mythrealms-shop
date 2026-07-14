# Operations Hub Design

## Goal

Build an admin-only operating hub for MythRealms that turns manually submitted 1688 product candidates, Outlook inbox activity, storefront operations, Pinterest publishing state, and optional GA4 metrics into actionable daily work.

## Scope

The first release contains three independent modules that share the existing admin authentication and Prisma database.

### 1688 Candidate Review

An administrator creates a candidate by pasting a 1688 product URL and entering procurement price in CNY, minimum order quantity, estimated shipping cost in CNY, material and specification notes, supplier name, and whether the supplier supports dropshipping.

The system calculates a deterministic score from margin, MOQ, dropshipping support, source-data completeness, and material-risk flags. It displays an estimated landed cost in USD and a suggested selling price. Candidates remain internal review records with `PENDING`, `SAVED`, or `REJECTED` status. The system does not scrape 1688 or publish candidates as storefront products.

### Outlook Inbox Automation

Microsoft Graph change notifications deliver new inbox activity to a protected webhook. The system retrieves the email, deduplicates it, classifies it, records an audit event, and takes one of two actions.

- A known order-status or tracked-shipping inquiry receives a template reply only when the matched order data is sufficient.
- A common FAQ receives one template reply per conversation in a 24-hour period.
- Refunds, cancellations, address changes, product-quality complaints, payment disputes, supplier negotiations, and uncertain messages create a high-priority review item and reply draft only.

The system never automatically refunds, cancels orders, edits shipping addresses, or sends marketing campaigns. Microsoft refresh credentials are encrypted before database storage. Webhook validation, client-state verification, idempotency, and failures are recorded.

### Daily Operating Report

At 09:00 Asia/Shanghai time, the daily Cron generates an operations report containing orders, low-stock signals, Pinterest draft and publish activity, candidate-review counts, email exceptions, and optional GA4 traffic and ecommerce funnel metrics. The report is stored in the database, displayed in the admin hub, and delivered to `mythrealms@outlook.com`.

GA4 is an optional integration. A missing GA4 configuration produces an explicit unconfigured section without failing the report.

## Architecture

The admin route `/admin/operations` presents three tabs: Daily Report, 1688 Candidates, and Inbox Queue. Each tab reads only from internal APIs protected by the existing `ADMIN` role check.

Server-side integrations are isolated behind focused modules:

- `operations/candidate-scoring` owns candidate validation, deterministic costs, and scoring.
- `operations/reporting` assembles daily report sections from orders, inventory, Pinterest drafts, candidate state, mailbox activity, and the optional GA4 adapter.
- `operations/outlook` owns Graph authentication, subscription handling, message retrieval, classification, templates, and sending rules.

The current daily Pinterest Cron is moved to 01:00 UTC, which is 09:00 in Asia/Shanghai, and invokes the daily operating report after its Pinterest tasks. A separate Graph subscription renewal job runs with the daily Cron. Inbox replies are event-driven through Graph notifications rather than daily polling.

## Data Model

`SourcingCandidate` stores supplier input, calculated costs, recommendation score, score explanation, review status, and review timestamps.

`OperationsReport` stores the report date, serialized sections, email-delivery result, and generation timestamps. A unique date key makes daily generation idempotent.

`MailboxAutomationEvent` stores the Graph message and conversation identifiers, classification, selected action, automated-send result, draft identifier, error details, and timestamps. A unique Graph message ID prevents repeated processing.

`MicrosoftGraphCredential` stores the encrypted refresh token, token expiry, subscription identifier, subscription expiry, and mailbox address. Only one enabled mailbox is supported in this release.

## Configuration

The release requires Microsoft Graph app credentials and a 32-byte application encryption key. It optionally accepts GA4 property and service-account credentials. All values are server-only environment variables and are never exposed through `NEXT_PUBLIC_` variables.

## Error Handling

An unavailable external provider does not make candidate review or the rest of the operations dashboard unavailable. The corresponding section reports a configuration or delivery failure. Message processing retries only for transient Graph failures and does not send a second reply after a completed automation event.

## Verification

Unit tests cover CNY-to-USD calculation, margin scoring, incomplete-candidate handling, classifier outcomes, and the no-auto-send rules. Route tests cover admin authorization, webhook verification, duplicate-message handling, and daily report idempotency. The completed feature also requires Prisma validation, targeted linting, production build, and browser checks for the admin flow.

## Out of Scope

This release excludes 1688 scraping, 1688 official API synchronization, automatic storefront publishing, automatic refunds, address modifications, marketing-email campaigns, multiple inboxes, and a user-facing Outlook connection wizard.
