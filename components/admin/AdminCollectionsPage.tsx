"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Shield } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { CHAINS, type ChainSlug } from "@/config/chains";
import { collectionInputSchema } from "@/lib/schemas/collection";
import { useTranslation } from "@/hooks/useTranslation";

const chainEntries = Object.entries(CHAINS) as [ChainSlug, typeof CHAINS[ChainSlug]][];

type SourceKind = "config" | "database";

type AdminCollection = {
  chain: ChainSlug;
  slug: string;
  name: string;
  standard: "erc721" | "erc1155";
  contract: `0x${string}`;
  image?: string;
  tags?: string[];
  mintUrl?: string;
  startBlock?: string;
  addedAt?: string;
  source: SourceKind;
  updatedAt?: string;
};

type ApiCollectionPayload = {
  chain: string;
  slug: string;
  name: string;
  standard: "erc721" | "erc1155";
  contract: `0x${string}`;
  image?: string | null;
  tags?: string[] | null;
  mintUrl?: string | null;
  startBlock?: string | null;
  addedAt?: string | null;
  source?: SourceKind;
  updatedAt?: string | null;
};

type AdminCollectionsResponse =
  | { ok: true; collections: ApiCollectionPayload[] }
  | { ok: false; error?: string };

type AdminMutationResponse =
  | { ok: true; collection: ApiCollectionPayload | null }
  | { ok: false; error?: string };

type BasicResponse = { ok: true } | { ok: false; error?: string };

type FormState = {
  chain: ChainSlug;
  name: string;
  slug: string;
  standard: "erc721" | "erc1155";
  contract: string;
  image: string;
  mintUrl: string;
  startBlock: string;
  addedAt: string;
  tags: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & { submit?: string };

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

const DEFAULT_CHAIN = chainEntries[0]?.[0] ?? "base";

const emptyForm: FormState = {
  chain: DEFAULT_CHAIN,
  name: "",
  slug: "",
  standard: "erc721",
  contract: "",
  image: "",
  mintUrl: "",
  startBlock: "",
  addedAt: "",
  tags: ""
};

export function AdminCollectionsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [chainFilter, setChainFilter] = useState<ChainSlug | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<AdminCollection | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/nfts", { headers: { "Cache-Control": "no-cache" } });
        const payload = (await response.json()) as AdminCollectionsResponse;
        if (!response.ok) {
          throw new Error(response.statusText || "FAILED");
        }
        if (!payload.ok) {
          throw new Error(payload.error ?? "FAILED");
        }
        if (cancelled) return;
        const fetched = payload.collections
          .map(toAdminCollection)
          .filter((item): item is AdminCollection => Boolean(item));
        setCollections(fetched);
      } catch (err) {
        console.error("Failed to load admin collections", err);
        if (!cancelled) setError(t("admin_error_load"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredCollections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return collections
      .filter((collection) => {
        if (chainFilter !== "all" && collection.chain !== chainFilter) return false;
        if (!normalizedQuery) return true;
        const haystack = [collection.name, collection.slug, ...(collection.tags ?? [])].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => {
        const aDate = a.addedAt ? Date.parse(a.addedAt) : 0;
        const bDate = b.addedAt ? Date.parse(b.addedAt) : 0;
        if (bDate !== aDate) return bDate - aDate;
        return a.name.localeCompare(b.name);
      });
  }, [collections, chainFilter, query]);

  const openCreateForm = () => {
    setForm({ ...emptyForm, chain: chainFilter === "all" ? DEFAULT_CHAIN : chainFilter });
    setFormErrors({});
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (collection: AdminCollection) => {
    setForm({
      chain: collection.chain,
      name: collection.name,
      slug: collection.slug,
      standard: collection.standard,
      contract: collection.contract,
      image: collection.image ?? "",
      mintUrl: collection.mintUrl ?? "",
      startBlock: collection.startBlock ?? "",
      addedAt: collection.addedAt ?? "",
      tags: (collection.tags ?? []).join(", ")
    });
    setFormErrors({});
    setEditing(collection);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setFormErrors({});
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;

    const payload = {
      chain: form.chain,
      slug: form.slug,
      name: form.name,
      standard: form.standard,
      contract: form.contract,
      image: form.image || undefined,
      mintUrl: form.mintUrl || undefined,
      startBlock: form.startBlock || undefined,
      addedAt: form.addedAt || undefined,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    const parsed = collectionInputSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const errors: FormErrors = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          errors[key as keyof FormState] = messages[0];
        }
      }
      setFormErrors(errors);
      setToast({ type: "error", message: t("admin_error_validation") });
      return;
    }

    setSaving(true);
    setFormErrors({});

    try {
      const body = JSON.stringify(parsed.data);
      const response = await fetch(
        editing ? `/api/admin/nfts/${form.chain}/${form.slug}` : "/api/admin/nfts",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body
        }
      );
      const payload = (await response.json()) as AdminMutationResponse;
      if (!response.ok) {
        throw new Error(response.statusText || "FAILED");
      }
      if (!payload.ok) {
        throw new Error(payload.error ?? "FAILED");
      }

      const updated = payload.collection ? toAdminCollection(payload.collection) : null;
      if (updated) {
        setCollections((prev) => {
          const existingIndex = prev.findIndex((item) => item.chain === updated.chain && item.slug === updated.slug);
          if (existingIndex >= 0) {
            const next = [...prev];
            next[existingIndex] = updated;
            return next;
          }
          return [...prev, updated];
        });
      }

      setToast({ type: "success", message: t("admin_toast_saved") });
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("Failed to save collection", err);
      setToast({ type: "error", message: t("admin_error_save") });
      setFormErrors((prev) => ({ ...prev, submit: (err as Error).message }));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (collection: AdminCollection) => {
    if (collection.source !== "database") return;
    const confirmationMessage = t("admin_confirm_delete").replace("{name}", collection.name);
    const confirmed = window.confirm(confirmationMessage);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/nfts/${collection.chain}/${collection.slug}`, { method: "DELETE" });
      const payload = (await response.json()) as BasicResponse;
      if (!response.ok) {
        throw new Error(response.statusText || "FAILED");
      }
      if (!payload.ok) {
        throw new Error(payload.error ?? "FAILED");
      }
      setCollections((prev) => prev.filter((item) => !(item.chain === collection.chain && item.slug === collection.slug)));
      setToast({ type: "success", message: t("admin_toast_deleted") });
    } catch (err) {
      console.error("Failed to delete collection", err);
      setToast({ type: "error", message: t("admin_error_delete") });
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await fetch("/api/admin/session", { method: "DELETE" });
      setToast({ type: "success", message: t("admin_toast_logout") });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-900">{t("admin_nfts")}</h1>
          <p className="text-sm text-slate-500">{t("admin_login_subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Plus size={16} />
            {t("admin_add")}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 disabled:opacity-60"
          >
            <Shield size={16} />
            {signingOut ? t("admin_loading") : t("admin_logout_button")}
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus-within:border-sky-300 focus-within:text-sky-600">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("admin_search_placeholder")}
              className="w-full bg-transparent text-base text-slate-900 outline-none"
            />
          </label>
          <select
            value={chainFilter}
            onChange={(event) => setChainFilter(event.target.value === "all" ? "all" : (event.target.value as ChainSlug))}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="all">{t("admin_chain_filter")}</option>
            {chainEntries.map(([slug, meta]) => (
              <option key={slug} value={slug}>
                {meta.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-8 text-slate-600">
            <Loader2 size={18} className="animate-spin" />
            {t("admin_loading")}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : filteredCollections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-slate-400">
            {t("admin_empty")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("admin_form_name")}</th>
                  <th className="px-4 py-3">{t("admin_col_slug")}</th>
                  <th className="px-4 py-3">{t("admin_form_chain")}</th>
                  <th className="px-4 py-3">{t("admin_col_standard")}</th>
                  <th className="px-4 py-3">{t("admin_col_contract")}</th>
                  <th className="px-4 py-3">{t("admin_col_updated")}</th>
                  <th className="px-4 py-3">{t("admin_table_actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredCollections.map((collection) => (
                  <tr key={`${collection.chain}:${collection.slug}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{collection.name}</span>
                        <span className="text-xs text-slate-500">{collection.tags?.map((tag) => `#${tag}`).join(" ")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-500">{collection.slug}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {CHAINS[collection.chain].name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-600">
                        {collection.standard === "erc721" ? t("admin_standard_erc721") : t("admin_standard_erc1155")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-500">{collection.contract}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {collection.updatedAt ? new Date(collection.updatedAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            collection.source === "database"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {collection.source === "database" ? t("admin_source_database") : t("admin_source_config")}
                        </span>
                        {collection.source === "database" && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditForm(collection)}
                              className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(collection)}
                              className="inline-flex items-center rounded-full border border-red-200 p-2 text-red-500 transition hover:border-red-300 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast ? (
        <div
          className={clsx(
            "fixed bottom-6 right-6 rounded-2xl px-4 py-3 text-sm shadow-lg",
            toast.type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {toast.message}
        </div>
      ) : null}

      {formOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-white/60 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {editing ? t("admin_edit") : t("admin_add")}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
              >
                {t("admin_cancel")}
              </button>
            </div>

            {formErrors.submit ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formErrors.submit}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_name")}</span>
                  <input
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    className={clsx(
                      "rounded-xl border px-3 py-2 text-base shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200",
                      formErrors.name ? "border-red-300" : "border-slate-200"
                    )}
                  />
                  {formErrors.name ? <span className="text-xs text-red-500">{formErrors.name}</span> : null}
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_slug")}</span>
                  <input
                    value={form.slug}
                    onChange={(event) => handleChange("slug", event.target.value.toLowerCase())}
                    disabled={Boolean(editing)}
                    className={clsx(
                      "rounded-xl border px-3 py-2 text-base shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200",
                      formErrors.slug ? "border-red-300" : "border-slate-200",
                      editing ? "bg-slate-50 text-slate-500" : "bg-white"
                    )}
                  />
                  <span className="text-xs text-slate-400">{t("admin_form_slug_hint")}</span>
                  {formErrors.slug ? <span className="text-xs text-red-500">{formErrors.slug}</span> : null}
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_chain")}</span>
                  <select
                    value={form.chain}
                    onChange={(event) => handleChange("chain", event.target.value as ChainSlug)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-base focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    disabled={Boolean(editing)}
                  >
                    {chainEntries.map(([slug, meta]) => (
                      <option key={slug} value={slug}>
                        {meta.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_standard")}</span>
                  <select
                    value={form.standard}
                    onChange={(event) => handleChange("standard", event.target.value as "erc721" | "erc1155")}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-base focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  >
                    <option value="erc721">{t("admin_standard_erc721")}</option>
                    <option value="erc1155">{t("admin_standard_erc1155")}</option>
                  </select>
                  <span className="text-xs text-slate-400">{t("admin_form_standard_hint")}</span>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_contract")}</span>
                  <input
                    value={form.contract}
                    onChange={(event) => handleChange("contract", event.target.value)}
                    className={clsx(
                      "rounded-xl border px-3 py-2 font-mono text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200",
                      formErrors.contract ? "border-red-300" : "border-slate-200"
                    )}
                    placeholder="0x..."
                  />
                  {formErrors.contract ? <span className="text-xs text-red-500">{formErrors.contract}</span> : null}
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_image")}</span>
                  <input
                    value={form.image}
                    onChange={(event) => handleChange("image", event.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="https://"
                  />
                  <span className="text-xs text-slate-400">{t("admin_form_image_hint")}</span>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_mint_url")}</span>
                  <input
                    value={form.mintUrl}
                    onChange={(event) => handleChange("mintUrl", event.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="https://"
                  />
                  <span className="text-xs text-slate-400">{t("admin_form_mint_url_hint")}</span>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_tags")}</span>
                  <input
                    value={form.tags}
                    onChange={(event) => handleChange("tags", event.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="quest, defi"
                  />
                  <span className="text-xs text-slate-400">{t("admin_form_tags_hint")}</span>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_start_block")}</span>
                  <input
                    value={form.startBlock}
                    onChange={(event) => handleChange("startBlock", event.target.value.replace(/[^0-9]/g, ""))}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="123456"
                  />
                  <span className="text-xs text-slate-400">{t("admin_form_start_block_hint")}</span>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{t("admin_form_added_at")}</span>
                  <input
                    value={form.addedAt}
                    onChange={(event) => handleChange("addedAt", event.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="2024-05-01"
                  />
                  <span className="text-xs text-slate-400">{t("admin_form_added_at_hint")}</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                  disabled={saving}
                >
                  {t("admin_cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-70"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {t("admin_save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function toAdminCollection(payload: ApiCollectionPayload): AdminCollection | null {
  if (!Object.prototype.hasOwnProperty.call(CHAINS, payload.chain)) {
    return null;
  }

  const tags = Array.isArray(payload.tags)
    ? payload.tags.filter((tag): tag is string => typeof tag === "string" && tag.length > 0)
    : undefined;

  return {
    chain: payload.chain as ChainSlug,
    slug: payload.slug,
    name: payload.name,
    standard: payload.standard,
    contract: payload.contract,
    image: payload.image ?? undefined,
    tags: tags && tags.length > 0 ? tags : undefined,
    mintUrl: payload.mintUrl ?? undefined,
    startBlock: payload.startBlock ?? undefined,
    addedAt: payload.addedAt ?? undefined,
    source: payload.source ?? "config",
    updatedAt: payload.updatedAt ?? undefined
  };
}
