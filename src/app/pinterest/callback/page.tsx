"use client";
import { useEffect, useState } from "react";

export default function OAuthCallback() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      // Exchange code for token
      fetch("/api/pinterest/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) })
        .then(r => r.json())
        .then(d => {
          if (d.access_token) setToken(d.access_token);
          else setError(JSON.stringify(d));
        })
        .catch(e => setError(e.message));
    } else {
      setError("No code in URL");
    }
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        {token ? (
          <>
            <h1 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">Token Generated!</h1>
            <textarea readOnly value={token} className="w-full h-40 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text)] font-mono break-all" />
            <p className="text-xs text-[var(--text-muted)] mt-2">Copy this token and paste it into the publish script.</p>
          </>
        ) : error ? (
          <>
            <h1 className="font-serif text-2xl font-bold text-[var(--sale)] mb-4">Error</h1>
            <p className="text-sm text-[var(--text-muted)] break-all">{error}</p>
          </>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">Exchanging code for token...</p>
        )}
      </div>
    </div>
  );
}
