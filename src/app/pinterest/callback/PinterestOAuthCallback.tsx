"use client";

import { useEffect, useState } from "react";

export function PinterestOAuthCallback({
  code,
  state,
}: {
  code: string;
  state: string;
}) {
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/pinterest/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.connected) {
          throw new Error(data.error || "Pinterest connection failed");
        }
        if (active) setStatus("connected");
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Pinterest connection failed");
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [code, state]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        {status === "connected" ? (
          <>
            <h1 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">
              Pinterest Connected
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              The credential is stored in a secure, server-readable session cookie.
            </p>
          </>
        ) : status === "error" ? (
          <>
            <h1 className="font-serif text-2xl font-bold text-[var(--sale)] mb-4">
              Connection Failed
            </h1>
            <p className="text-sm text-[var(--text-muted)]">{error}</p>
          </>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">Connecting Pinterest...</p>
        )}
      </div>
    </div>
  );
}
