"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      await signIn("credentials", { email, password, callbackUrl: "/account" });
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-sm text-[var(--text-muted)]">Join our community</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border-light)] rounded-xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)]" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)]" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[var(--primary)] text-white rounded-full font-semibold text-sm hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-light)]" /></div><div className="relative flex justify-center text-xs"><span className="bg-[var(--surface)] px-3 text-[var(--text-muted)]">or</span></div></div>

          <button onClick={() => signIn("google", { callbackUrl: "/account" })}
            className="w-full py-3 border border-[var(--border)] rounded-full font-medium text-sm hover:bg-[var(--bg)] transition flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-[var(--accent)] hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
