import { create } from "zustand";

type WalletState = {
  address: string | null;
  balance: string;
  isConnected: boolean;
  keplr: string;
  connect: (chainId: string) => Promise<void>;
  setBalance: (amount: string) => void;
  reset: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: "0",
  isConnected: false,
  keplr: "none",

  connect: async (chainId) => {
    if (!window.keplr) {
      set({ keplr: "not installed" });
      return;
    }

    // TODO: approve user UI
    await window.keplr.experimentalSuggestChain({
      chainId,
      chainName: "Bettery Local",
      rpc: "http://localhost:26657",
      rest: "http://localhost:1317",

      bip44: {
        coinType: 118,
      },

      bech32Config: {
        bech32PrefixAccAddr: "bettery",
        bech32PrefixAccPub: "betterypub",
        bech32PrefixValAddr: "betteryvaloper",
        bech32PrefixValPub: "betteryvaloperpub",
        bech32PrefixConsAddr: "betteryvalcons",
        bech32PrefixConsPub: "betteryvalconspub",
      },

      currencies: [
        {
          coinDenom: "BET",
          coinMinimalDenom: "ubet",
          coinDecimals: 6,
        },
      ],

      feeCurrencies: [
        {
          coinDenom: "BET",
          coinMinimalDenom: "ubet",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
          },
        },
      ],

      stakeCurrency: {
        coinDenom: "BET",
        coinMinimalDenom: "ubet",
        coinDecimals: 6,
      },
    });

    await window.keplr.enable(chainId);
    const signer = window.keplr.getOfflineSigner(chainId);
    const [account] = await signer.getAccounts();

    set({
      address: account.address,
      isConnected: true,
      keplr: "installed",
    });
  },

  setBalance: (amount) => set({ balance: amount }),

  reset: () =>
    set({
      address: null,
      balance: "0",
      isConnected: false,
      keplr: "none",
    }),
}));
