"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to subscribe");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 justify-center py-4 px-6 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg">
        <Check className="w-5 h-5 text-[var(--success)]" />
        <span className="text-[var(--success)] font-medium">You&apos;re on the list.</span>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        disabled={status === "loading"}
        className="h-12 w-full min-w-0 flex-1 rounded-lg border border-[#2A2520] bg-[var(--bg)] px-4 text-sm text-[#E8E0D5] outline-none transition-all placeholder:text-[#6B5F50] focus:border-[#D4A84B] focus:shadow-[0_0_0_3px_rgba(212,168,75,0.25)]"
      />
      <Button
        variant="accent"
        size="lg"
        type="submit"
        className="h-12 w-full px-8 sm:w-auto"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Subscribe"
        )}
      </Button>
      {status === "error" && (
        <p className="text-xs text-[var(--sale)] mt-1">{error}</p>
      )}
    </form>
  );
}
