"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sale-bg)]">
          <AlertTriangle className="h-8 w-8 text-[var(--sale)]" />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-2xl font-bold text-[var(--text)] mb-3">
          Something went wrong
        </h1>

        {/* Message */}
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
          An unexpected error occurred. This might be a temporary issue -- please
          try again. If the problem persists,{" "}
          <Link href="/contact" className="text-[var(--accent)] underline underline-offset-2 hover:text-[var(--accent-hover)]">
            contact us
          </Link>
          {" "}and we will help you right away.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--text-muted)] hover:bg-[var(--border-light)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
