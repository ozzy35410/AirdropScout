"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type PersistOptions } from "zustand/middleware";

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

type PersistedGlobalState = Pick<GlobalState, "trackAddress" | "networkMode" | "language">;

const persistOptions: PersistOptions<GlobalState, PersistedGlobalState> = {
  name: storageName,
  storage: createJSONStorage<PersistedGlobalState>(() => localStorage),
  partialize: (state) => ({
    trackAddress: state.trackAddress,
    networkMode: state.networkMode,
    language: state.language
  })
};

export const useGlobal = create<GlobalState>()(
  persist(
    (set) => ({
      trackAddress: "",
      networkMode: "testnet",
      language: "en",
      setTrackAddress: (address: string) => set({ trackAddress: address }),
      setNetworkMode: (mode: NetworkMode) => set({ networkMode: mode }),
      setLanguage: (language: Language) => set({ language })
    }),
    persistOptions
  )
);
