import { create } from "zustand";

type ConfigState = {
  creatorPercent: number | null;
  companyPercent: number | null;
  loading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
};

export const useConfigStore = create<ConfigState>((set) => ({
  creatorPercent: null,
  companyPercent: null,
  loading: false,
  error: null,

  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/config", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to load config");
      }
      const { creatorPercent, companyPercent } = await res.json();
      set({
        creatorPercent: creatorPercent ?? null,
        companyPercent: companyPercent ?? null,
        loading: false,
        error: null,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load config";
      set({
        loading: false,
        error: message,
        creatorPercent: null,
        companyPercent: null,
      });
    }
  },
}));
