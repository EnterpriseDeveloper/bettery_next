import { Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient, defaultRegistryTypes } from "@cosmjs/stargate";
import { MsgMintToken } from "./proto-ts/bettery/funds/v1/tx";

const registry = new Registry(defaultRegistryTypes);

registry.register("/bettery.funds.v1.MsgMintToken", MsgMintToken);

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "bettery";

export async function mintToken() {
  await window.keplr.enable(chainId);

  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const address = accounts[0].address;

  const client = await SigningStargateClient.connectWithSigner(
    "https://rpc.bettery.io",
    offlineSigner,
    { registry },
  );

  const msg = {
    creator: address,
  };

  const result = await client.signAndBroadcast(
    address,
    [
      {
        typeUrl: "/bettery.funds.v1.MsgMintToken",
        value: msg,
      },
    ],
    "auto",
  );

  return result;
}
