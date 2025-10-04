"use client";

import { clsx } from "clsx";
import { CHAINS, type ChainSlug } from "@/config/chains";

type NetworkTabsProps = {
  chains: ChainSlug[];
  active: ChainSlug;
  onChange: (chain: ChainSlug) => void;
};

export function NetworkTabs({ chains, active, onChange }: NetworkTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chains.map((chain) => {
        const chainConfig = CHAINS[chain];
        return (
          <button
            key={chain}
            type="button"
            onClick={() => onChange(chain)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
              active === chain
                ? "border-sky-400 bg-sky-50 text-sky-700 shadow"
                : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-600"
            )}
          >
            {chainConfig.name}
          </button>
        );
      })}
    </div>
  );
}
