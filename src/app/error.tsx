"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--sale-bg)]">
          <span className="font-serif text-5xl text-[var(--accent)]">!</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">
          Something went wrong
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[var(--primary-hover)] transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
