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
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Failed to subscribe");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 justify-center py-4 px-6 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg">
        <Check className="w-5 h-5 text-[var(--success)]" />
        <span className="text-[var(--success)] font-medium">Welcome to the expedition. Check your inbox.</span>
      </div>
    );
  }

  return (
    <form className="flex gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        disabled={status === "loading"}
        className="flex-1 h-12 px-4 text-sm bg-[#24211D] border border-[#2A2520] rounded-lg text-[#E8E0D5] placeholder:text-[#6B5F50] outline-none focus:border-[#D4A84B] focus:shadow-[0_0_0_3px_rgba(212,168,75,0.25)] transition-all"
      />
      <Button
        variant="accent"
        size="lg"
        type="submit"
        className="h-12 px-8"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Embark"
        )}
      </Button>
      {status === "error" && (
        <p className="text-xs text-[var(--sale)] mt-1">{error}</p>
      )}
    </form>
  );
}
