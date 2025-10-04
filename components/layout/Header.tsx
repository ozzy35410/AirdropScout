"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useGlobal, type GlobalState, type NetworkMode } from "@/state/useGlobal";
import { useTranslation } from "@/hooks/useTranslation";
import { formatChecksum, isValidAddress, normalizeAddress } from "@/lib/address";

const DEBOUNCE_MS = 500;

const networkModes: NetworkMode[] = ["mainnet", "testnet"];

export function Header() {
  const { t } = useTranslation();
  const trackAddress = useGlobal((state: GlobalState) => state.trackAddress);
  const setTrackAddress = useGlobal((state: GlobalState) => state.setTrackAddress);
  const networkMode = useGlobal((state: GlobalState) => state.networkMode);
  const setNetworkMode = useGlobal((state: GlobalState) => state.setNetworkMode);
  const language = useGlobal((state: GlobalState) => state.language);
  const setLanguage = useGlobal((state: GlobalState) => state.setLanguage);

  const [value, setValue] = useState(trackAddress);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(trackAddress);
  }, [trackAddress]);

  useEffect(() => {
    if (!value) {
      setError(null);
      return;
    }
    if (!isValidAddress(value)) {
      setError(t("invalid_address"));
    } else {
      setError(null);
    }
  }, [value, t]);

  useEffect(() => {
    const controller = setTimeout(() => {
      const sanitized = normalizeAddress(value);
      setTrackAddress(sanitized);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(controller);
    };
  }, [value, setTrackAddress]);

  const displayValue = useMemo(() => {
    if (!value) return "";
    if (!isValidAddress(value)) return value;
    return formatChecksum(value);
  }, [value]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xl font-semibold text-slate-900"
          >
            {t("brand")}
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <Link
              href="/tasks"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              {t("tasks")}
            </Link>
            <Link
              href="/nfts"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              {t("nfts")}
            </Link>
            <Link
              href="/faucets"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              {t("faucets")}
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              {t("admin")}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 p-1 text-sm sm:flex">
            {networkModes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setNetworkMode(mode)}
                className={clsx(
                  "rounded-full px-4 py-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                  networkMode === mode
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {t(mode)}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "tr" : "en")}
            className="hidden rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 sm:block"
          >
            {language === "en" ? "TR" : "EN"}
          </button>

          <div className="w-full max-w-md">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {t("track_by_address")}
              </span>
              <input
                type="text"
                value={displayValue}
                onChange={(event) => setValue(event.target.value.trim())}
                placeholder={t("enter_address")}
                className={clsx(
                  "w-full rounded-xl border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400",
                  error ? "border-red-300" : "border-slate-200"
                )}
                spellCheck={false}
                autoComplete="off"
              />
            </label>
            <div className="mt-1 min-h-[1.2rem] text-xs text-red-500">
              {error ? error : value ? "" : t("paste_address_hint")}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
