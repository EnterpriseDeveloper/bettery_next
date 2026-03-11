import { OfflineDirectSigner, Registry } from "@cosmjs/proto-signing";
import {
  defaultRegistryTypes,
  GasPrice,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { OfflineAminoSigner } from "@keplr-wallet/types";
import { MsgBurnToEvm } from "./proto-ts/bettery/funds/v1/tx";

const registry = new Registry(defaultRegistryTypes);
registry.register("/bettery.funds.v1.MsgBurnToEvm", MsgBurnToEvm);

const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_URL as string;

export const txWithdrawal = async (
  signer: OfflineAminoSigner & OfflineDirectSigner,
  address: string,
  receiver: string,
  amount: string,
) => {
  try {
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      signer,
      { registry, gasPrice: GasPrice.fromString("0ubet") },
    );
    const msg = {
      typeUrl: "/bettery.funds.v1.MsgBurnToEvm",
      value: MsgBurnToEvm.fromPartial({
        creator: address,
        evmChainId: process.env.NEXT_PUBLIC_EVM_CHAIN_ID as unknown as number,
        evmBridge: process.env.NEXT_PUBLIC_EVM_BRIDGE as string,
        evmToken: process.env.NEXT_PUBLIC_EVM_TOKEN as string,
        evmRecipient: receiver,
        amount: (Number(amount) * 1000000).toString(),
      }),
    };
    const result = await client.signAndBroadcast(address, [msg], "auto");
    console.log(result);
    return result;
  } catch (err) {
    console.log(`FROM txWithdrawal: ${err}`);
  }
};
