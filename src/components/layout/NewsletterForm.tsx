"use client";

import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  return (
    <form
      className="flex gap-3"
      onSubmit={(e) => { e.preventDefault(); /* TODO: connect to newsletter API */ }}
    >
      <input
        type="email"
        placeholder="Your email address"
        required
        className="flex-1 h-12 px-4 text-sm bg-[#24211D] border border-[#2A2520] rounded-lg text-[#E8E0D5] placeholder:text-[#6B5F50] outline-none focus:border-[#D4A84B] focus:shadow-[0_0_0_3px_rgba(212,168,75,0.25)] transition-all"
      />
      <Button
        variant="accent"
        size="lg"
        type="submit"
        className="h-12 px-8"
      >
        Embark
      </Button>
    </form>
  );
}
