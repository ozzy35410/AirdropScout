"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NetworkMode = "mainnet" | "testnet";
export type Language = "en" | "tr";

export type GlobalState = {
  trackAddress: string;
  networkMode: NetworkMode;
  language: Language;
  setTrackAddress: (address: string) => void;
  setNetworkMode: (mode: NetworkMode) => void;
  setLanguage: (language: Language) => void;
};

const storageName = "airdropscout-global";

export const useGlobal = create<GlobalState>()(
  persist<GlobalState>(
    (set) => ({
      trackAddress: "",
      networkMode: "testnet",
      language: "en",
      setTrackAddress: (address: string) => set({ trackAddress: address }),
      setNetworkMode: (mode: NetworkMode) => set({ networkMode: mode }),
      setLanguage: (language: Language) => set({ language })
    }),
    {
      name: storageName,
      storage: createJSONStorage<GlobalState>(() => localStorage),
      partialize: (state) => ({
        trackAddress: state.trackAddress,
        networkMode: state.networkMode,
        language: state.language
      })
    }
  )
);
