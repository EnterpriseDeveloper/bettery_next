const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "bettery";

export const walletInit = async () => {
  if (!window.keplr) {
    return {
      keplr: "not installed",
      signer: null,
      address: null,
    };
  } else {
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

    return {
      signer: signer,
      address: account.address,
      keplr: "installed",
    };
  }
};
