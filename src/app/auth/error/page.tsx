"use client";

import Link from "next/link";

export default function AuthErrorPage() {
  const errors: Record<string, string> = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
      "This email is already associated with another sign-in method. Please use that method instead.",
    EmailSignin: "Check your email for the sign-in link.",
    CredentialsSignin: "Invalid email or password. Please try again.",
    SessionRequired: "Please sign in to access this page.",
    default: "An authentication error occurred. Please try again.",
  };

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const errorCode = params?.get("error") || "default";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--sale-bg)]">
          <span className="font-serif text-5xl text-[var(--accent)]">?</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">
          Authentication Error
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          {errors[errorCode] || errors.default}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[var(--primary-hover)] transition"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text)] px-8 py-3 rounded-full font-semibold text-sm hover:bg-[var(--border-light)] transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
