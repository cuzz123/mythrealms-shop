"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Check, Loader2 } from "lucide-react";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const errorId = useId();
  const isDark = tone === "dark";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
    } catch (submissionError: unknown) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Failed to subscribe");
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center justify-center gap-3 rounded-[var(--radius-md)] border px-6 py-4 ${
        isDark ? "border-white/20 bg-white/5" : "border-[var(--success)]/20 bg-[var(--success)]/10"
      }`}>
        <Check className="h-5 w-5 text-[var(--success)]" />
        <span aria-live="polite" className={`font-medium ${isDark ? "text-[#b5dfca]" : "text-[var(--success)]"}`}>
          You&apos;re on the list.
        </span>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        required
        disabled={status === "loading"}
        aria-describedby={status === "error" ? errorId : undefined}
        className={`h-12 w-full min-w-0 flex-1 rounded-[var(--radius-md)] border px-4 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 ${
          isDark
            ? "border-white/30 bg-transparent text-white placeholder:text-white/55 focus:border-white focus:ring-offset-[var(--charcoal)]"
            : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-offset-[var(--surface-alt)]"
        }`}
      />
      <Button
        variant="primary"
        size="lg"
        type="submit"
        className="h-12 w-full px-8 sm:w-auto"
        disabled={status === "loading"}
      >
        {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Subscribe"}
      </Button>
      {status === "error" && (
        <p id={errorId} role="alert" className={`mt-1 text-xs ${isDark ? "text-[#f0b8a8]" : "text-[var(--sale)]"}`}>
          {error}
        </p>
      )}
    </form>
  );
}
