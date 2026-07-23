"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDialogFocus } from "@/lib/client/use-dialog-focus";

export const FIRST_ORDER_INVITATION_DELAY_MS = 20_000;
export const FIRST_ORDER_INVITATION_COOLDOWN_DAYS = 14;
const DISMISSAL_STORAGE_KEY = "mythrealms:first-order-invitation-dismissed-at";
const SESSION_STORAGE_KEY = "mythrealms:first-order-invitation-shown";

type InvitationCopy = Readonly<{
  title: string;
  description: string;
  submitLabel: string;
}>;

export function getFirstOrderInvitationCopy(campaignCode?: string): InvitationCopy {
  const normalizedCode = campaignCode?.trim();
  if (normalizedCode) {
    return {
      title: "A note for your first order.",
      description: `Subscribe for new pearl notes and keep welcome code ${normalizedCode} for a future order.`,
      submitLabel: "Keep my code",
    };
  }

  return {
    title: "Notes from the coast.",
    description: "Subscribe for new pearl arrivals, thoughtful stories, and quiet notes from MythRealms.",
    submitLabel: "Subscribe",
  };
}

export function shouldShowFirstOrderInvitation({
  now,
  dismissedAt,
  sessionShown,
  cooldownDays = FIRST_ORDER_INVITATION_COOLDOWN_DAYS,
}: {
  now: number;
  dismissedAt: number | null;
  sessionShown: boolean;
  cooldownDays?: number;
}): boolean {
  if (sessionShown) return false;
  if (dismissedAt === null || !Number.isFinite(dismissedAt)) return true;

  return now >= dismissedAt + cooldownDays * 24 * 60 * 60 * 1000;
}

function getStoredTimestamp(storageKey: string): number | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    if (value === null) return null;
    const timestamp = Number(value);
    return Number.isFinite(timestamp) ? timestamp : null;
  } catch {
    return null;
  }
}

function getSessionShown(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function markSessionShown() {
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
  } catch {
    // Private browsing storage can be unavailable; the mounted component state remains a fallback.
  }
}

export function FirstOrderInvitation({
  campaignCode,
  cooldownDays = FIRST_ORDER_INVITATION_COOLDOWN_DAYS,
}: {
  campaignCode?: string;
  cooldownDays?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const errorId = useId();
  const copy = getFirstOrderInvitationCopy(campaignCode);

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISSAL_STORAGE_KEY, String(Date.now()));
    } catch {
      // Dismissing should still work when storage is blocked.
    }
    markSessionShown();
    setIsOpen(false);
  }

  useDialogFocus({
    isOpen,
    onClose: dismiss,
    containerRef: dialogRef,
    initialFocusRef: emailRef,
  });

  useEffect(() => {
    const dismissedAt = getStoredTimestamp(DISMISSAL_STORAGE_KEY);
    if (!shouldShowFirstOrderInvitation({ now: Date.now(), dismissedAt, sessionShown: getSessionShown(), cooldownDays })) {
      return;
    }

    let hasEngaged = false;
    let delayComplete = false;

    const reveal = () => {
      if (!hasEngaged || !delayComplete) return;
      markSessionShown();
      setIsOpen(true);
    };

    const markEngaged = () => {
      hasEngaged = true;
      reveal();
    };

    window.addEventListener("pointerdown", markEngaged, { once: true, passive: true });
    window.addEventListener("keydown", markEngaged, { once: true });
    window.addEventListener("scroll", markEngaged, { once: true, passive: true });
    const timer = setTimeout(() => {
      delayComplete = true;
      reveal();
    }, FIRST_ORDER_INVITATION_DELAY_MS);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", markEngaged);
      window.removeEventListener("keydown", markEngaged);
      window.removeEventListener("scroll", markEngaged);
    };
  }, [cooldownDays]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Newsletter signup is temporarily unavailable");
      }
      setStatus("success");
      requestAnimationFrame(() => closeRef.current?.focus());
    } catch (submissionError: unknown) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Newsletter signup is temporarily unavailable");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-end bg-black/35 p-4 sm:items-center sm:justify-center" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-order-invitation-title"
        className="w-full max-w-md border border-[var(--border)] bg-[var(--surface-raised)] p-6 shadow-[var(--shadow-xl)] motion-reduce:transition-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">MythRealms Notes</p>
            <h2 id="first-order-invitation-title" className="mt-3 font-serif text-2xl font-medium text-[var(--text)]">
              {copy.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss newsletter invitation"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{copy.description}</p>

        {status === "success" ? (
          <div className="mt-6 border border-[var(--success)]/20 bg-[var(--success)]/10 p-4">
            <p aria-live="polite" className="flex items-center gap-2 text-sm font-medium text-[var(--success)]">
              <Check className="h-5 w-5" aria-hidden="true" /> You&apos;re on the list.
            </p>
            <Button ref={closeRef} type="button" variant="outline" className="mt-4" onClick={dismiss}>
              Close
            </Button>
          </div>
        ) : (
          <form className="mt-6" onSubmit={handleSubmit}>
            <label htmlFor="first-order-email" className="sr-only">Email address</label>
            <input
              ref={emailRef}
              id="first-order-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              required
              disabled={status === "loading"}
              aria-describedby={status === "error" ? errorId : undefined}
              className="h-12 w-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 motion-reduce:transition-none"
            />
            {status === "error" && (
              <p id={errorId} role="alert" className="mt-2 text-xs text-[var(--sale)]">{error}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : copy.submitLabel}
              </Button>
              <button type="button" onClick={dismiss} className="text-sm font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text)]">
                Not now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
