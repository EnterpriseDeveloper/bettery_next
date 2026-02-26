import { OfflineDirectSigner, Registry } from "@cosmjs/proto-signing";
import {
  defaultRegistryTypes,
  GasPrice,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { OfflineAminoSigner } from "@keplr-wallet/types";
import { MsgBurnToEvm } from "./proto-ts/bettery/funds/v1/tx";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

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
    const amountCoin: Coin = {
      denom: "ubet", // TODO: MOVE TO COSMOS SDK LOGIC
      amount: (Number(amount) * 1000000).toString(), // string!
    };
    const msg = {
      typeUrl: "/bettery.funds.v1.MsgBurnToEvm",
      value: MsgBurnToEvm.fromPartial({
        creator: address,
        evmChainId: 80001, // TODO
        evmBridge: "0xdf0d76a719484C74a4CEcD3BA614265d8A017F73", // TODO
        evmToken: receiver,
        evmRecipient: "0xCBC1Ca657D5C06Da86835bbE9901260f09Eb4c3B", // TODO
        amount: amountCoin,
      }),
    };
    const result = await client.signAndBroadcast(address, [msg], "auto");
    console.log(result);
    return result;
  } catch (err) {
    console.log(`FROM txWithdrawal: ${err}`);
  }
};
