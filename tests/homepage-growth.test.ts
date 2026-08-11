import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  FIRST_ORDER_INVITATION_DELAY_MS,
  getFirstOrderInvitationCopy,
  shouldShowFirstOrderInvitation,
} from "../src/components/growth/FirstOrderInvitation";
import { BRAND } from "../src/lib/brand-identity";

const source = (relativePath: string) =>
  readFileSync(resolve(relativePath), "utf8");

test("homepage appends the growth bands after the existing editorial sections", () => {
  const page = source("src/app/page.tsx");
  const categoryIndex = page.indexOf("<HomepageCategoryStories />");
  const occasionIndex = page.indexOf("<HomepageOccasionEdit");
  const pearlEditIndex = page.indexOf("<HomepagePearlEdit");
  const editorialIndex = page.indexOf("<HomepageEditorialStory />");
  const giftIndex = page.indexOf("<HomepageGiftSets");

  assert.ok(categoryIndex >= 0);
  assert.ok(occasionIndex > categoryIndex);
  assert.ok(pearlEditIndex > occasionIndex);
  assert.ok(editorialIndex > pearlEditIndex);
  assert.ok(giftIndex > editorialIndex);
  assert.doesNotMatch(page, /HomepageGuardian|HomepageWhyPearls/);
});

test("global providers preserve children without mounting the first-order invitation", () => {
  const providers = source("src/app/providers.tsx");

  assert.match(providers, /\{children\}/);
  assert.doesNotMatch(providers, /<FirstOrderInvitation\b/);
  assert.doesNotMatch(
    providers,
    /import\s+\{\s*FirstOrderInvitation\s*\}\s+from/,
  );
});

test("first-order invitation uses notes language without a configured campaign", () => {
  const copy = getFirstOrderInvitationCopy();

  assert.match(copy.title, /notes/i);
  assert.doesNotMatch(`${copy.title} ${copy.description} ${copy.submitLabel}`, /discount|%|\$|code/i);
});

test("Phase 1 invitation and homepage product cards use the shared public brand", () => {
  const copy = getFirstOrderInvitationCopy();
  const invitation = source("src/components/growth/FirstOrderInvitation.tsx");
  const productCard = source("src/components/product/ProductCard.tsx");

  assert.match(copy.description, new RegExp(BRAND.name));
  assert.match(invitation, /\{SITE_NAME\} Notes/);
  assert.match(productCard, /\$\{BRAND\.name\} pearl jewelry/);
});

test("first-order invitation only references a supplied campaign code", () => {
  const copy = getFirstOrderInvitationCopy("WELCOME10");

  assert.match(copy.description, /WELCOME10/);
  assert.match(copy.description, /code/i);
});

test("first-order invitation dismissal waits fourteen days by default", () => {
  const dismissedAt = Date.UTC(2026, 6, 23, 12, 0, 0);
  const beforeCooldownEnds = dismissedAt + 14 * 24 * 60 * 60 * 1000 - 1;
  const whenCooldownEnds = dismissedAt + 14 * 24 * 60 * 60 * 1000;

  assert.equal(
    shouldShowFirstOrderInvitation({
      now: beforeCooldownEnds,
      dismissedAt,
      sessionShown: false,
    }),
    false,
  );
  assert.equal(
    shouldShowFirstOrderInvitation({
      now: whenCooldownEnds,
      dismissedAt,
      sessionShown: false,
    }),
    true,
  );
});

test("first-order invitation never displays twice in a session and waits twenty seconds", () => {
  assert.equal(FIRST_ORDER_INVITATION_DELAY_MS, 20_000);
  assert.equal(
    shouldShowFirstOrderInvitation({
      now: Date.UTC(2026, 6, 23),
      dismissedAt: null,
      sessionShown: true,
    }),
    false,
  );
});

test("opening the first-order invitation clears the engagement listeners before Escape can dismiss it", () => {
  const invitation = source("src/components/growth/FirstOrderInvitation.tsx");

  assert.match(invitation, /if \(isOpen\) \{\s*return;/);
  assert.match(invitation, /\[cooldownDays, isOpen\]/);
});
