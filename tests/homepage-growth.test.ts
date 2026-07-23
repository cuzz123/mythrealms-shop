import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  FIRST_ORDER_INVITATION_DELAY_MS,
  getFirstOrderInvitationCopy,
  shouldShowFirstOrderInvitation,
} from "../src/components/growth/FirstOrderInvitation";

const source = (relativePath: string) =>
  readFileSync(resolve(relativePath), "utf8");

test("homepage appends the growth bands after the existing editorial sections", () => {
  const page = source("src/app/page.tsx");
  const editorialIndex = page.indexOf("<HomepageGuardian />");
  const occasionIndex = page.indexOf("<HomepageOccasionEdit");
  const giftIndex = page.indexOf("<HomepageGiftSets");
  const whyIndex = page.indexOf("<HomepageWhyPearls");

  assert.ok(editorialIndex >= 0);
  assert.ok(occasionIndex > editorialIndex);
  assert.ok(giftIndex > occasionIndex);
  assert.ok(whyIndex > giftIndex);
});

test("first-order invitation uses notes language without a configured campaign", () => {
  const copy = getFirstOrderInvitationCopy();

  assert.match(copy.title, /notes/i);
  assert.doesNotMatch(`${copy.title} ${copy.description} ${copy.submitLabel}`, /discount|%|\$|code/i);
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
