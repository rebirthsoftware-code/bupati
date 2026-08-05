"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PawIcon } from "@/components/icons";
import { site } from "@/data/site";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Giriş yapılamadı.");
        return;
      }
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-mint-100 to-cream-50 px-5">
      <div className="paw-pattern absolute inset-0 opacity-60" aria-hidden />
      <form onSubmit={submit} className="card relative w-full max-w-sm p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint-500 text-white">
            <PawIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold">{site.shortName} Panel</h1>
            <p className="text-xs text-ink-400">Canlı destek yönetimi</p>
          </div>
        </div>

        <label className="mt-8 mb-1.5 block text-xs font-bold text-ink-600" htmlFor="admin-pass">
          Panel şifresi
        </label>
        <input
          id="admin-pass"
          type="password"
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          required
        />

        {error && <p className="mt-3 text-xs font-bold text-coral-600">{error}</p>}

        <button type="submit" className="btn-primary mt-5 w-full" disabled={loading}>
          {loading ? "Kontrol ediliyor…" : "Giriş Yap"}
        </button>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-400">
          Şifre <code className="rounded bg-cream-200 px-1.5 py-0.5">ADMIN_PASSWORD</code> ortam değişkeni ile
          belirlenir. Tanımlı değilse varsayılan: <strong>bupati2024</strong>
        </p>
      </form>
    </div>
  );
}
