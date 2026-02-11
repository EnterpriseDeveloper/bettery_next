import { walletInit } from "@/tx/wallets";
import { OfflineAminoSigner, OfflineDirectSigner } from "@keplr-wallet/types";
import { create } from "zustand";

type WalletState = {
  address: string | null;
  balance: string;
  isConnected: boolean;
  signer: (OfflineAminoSigner & OfflineDirectSigner) | null;
  keplr: string;
  connect: () => Promise<void>;
  setBalance: (amount: string) => void;
  reset: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: "0",
  isConnected: false,
  keplr: "none",
  signer: null,

  connect: async () => {
    const { signer, address, keplr } = await walletInit();

    set({
      address: address,
      isConnected: true,
      keplr: keplr,
      signer: signer,
    });
  },

  setBalance: (amount) => set({ balance: amount }),

  reset: () =>
    set({
      address: null,
      balance: "0",
      isConnected: false,
      keplr: "none",
      signer: null,
    }),
}));
