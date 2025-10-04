"use client";

import { FormEvent, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "FAILED");
      }
      router.replace("/admin/nfts");
      router.refresh();
    } catch (error) {
      console.error("Admin login failed", error);
      setError(t("admin_login_error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-3xl border border-white/60 bg-white/90 p-8 text-slate-700 shadow"
      >
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{t("admin_login_title")}</h1>
          <p className="text-sm text-slate-500">{t("admin_login_subtitle")}</p>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-slate-600">{t("admin_password_label")}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder={t("admin_password_placeholder")}
            autoFocus
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-70"
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
          {t("admin_login_button")}
        </button>
      </form>
    </div>
  );
}
