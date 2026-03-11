const chainId = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const rpcAPI = process.env.NEXT_PUBLIC_RPC_URL as string;
const restAPI = process.env.NEXT_PUBLIC_REST_URL as string;

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
      chainName: chainId,
      rpc: rpcAPI,
      rest: restAPI,

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
            low: 0,
            average: 0,
            high: 0,
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
