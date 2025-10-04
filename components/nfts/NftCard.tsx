"use client";

import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";
import clsx from "clsx";
import type { ChainSlug } from "@/config/chains";
import { CHAINS } from "@/config/chains";
import type { TranslationKey } from "@/lib/i18n";

type CollectionCard = {
  slug: string;
  name: string;
  standard: "erc721" | "erc1155";
  contract: `0x${string}`;
  image?: string;
  tags?: string[];
  mintUrl?: string;
};

type Props = {
  chain: ChainSlug;
  collection: CollectionCard;
  minted: boolean | undefined;
  t: (key: TranslationKey) => string;
};

export function NftCard({ chain, collection, minted, t }: Props) {
  const chainConfig = CHAINS[chain];
  const explorerUrl = `${chainConfig.explorer}/address/${collection.contract}`;

  return (
    <div className="group flex h-full flex-col justify-between gap-5 rounded-3xl border border-white/40 bg-white/80 p-6 shadow transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-slate-50">
          {collection.image ? (
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sky-400">
              <Sparkles size={28} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{collection.name}</h3>
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
              {chainConfig.name}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold uppercase tracking-wide">
              {collection.standard.toUpperCase()}
            </span>
            {collection.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={clsx(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            minted
              ? "bg-emerald-100 text-emerald-700"
              : minted === false
              ? "bg-slate-200 text-slate-600"
              : "bg-slate-100 text-slate-500"
          )}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {minted ? t("minted") : minted === false ? t("not_minted") : t("minted_status_wait")}
        </span>
        <div className="flex flex-wrap gap-2">
          {collection.mintUrl ? (
            <a
              href={collection.mintUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Sparkles size={16} />
              {t("mint")}
            </a>
          ) : null}
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            <ExternalLink size={16} />
            {t("open_explorer")}
          </a>
        </div>
      </div>
    </div>
  );
}
