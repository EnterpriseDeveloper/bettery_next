import { create } from "zustand";
import { getCreatorPercent, getCompanyPercent } from "@/blockchain/cosmos/config";

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
      const [creatorPercent, companyPercent] = await Promise.all([
        getCreatorPercent(),
        getCompanyPercent(),
      ]);
      set({
        creatorPercent,
        companyPercent,
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
