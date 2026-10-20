"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      router.replace("/admin/ingest");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <label htmlFor="token" className="text-sm text-paper-muted">Admin token</label>
      <input
        id="token"
        type="password"
        autoComplete="current-password"
        autoFocus
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full rounded-2xl border border-hairline bg-ink-raised px-4 py-3 text-paper outline-none focus:border-hairline-strong"
        required
      />
      {error && <p role="alert" className="text-sm text-wrong">{error}</p>}
      <button type="submit" disabled={busy || !token} className="w-max rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink active:scale-[0.98] disabled:opacity-50">
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
