import { OfflineDirectSigner, Registry } from "@cosmjs/proto-signing";
import {
  GasPrice,
  SigningStargateClient,
  defaultRegistryTypes,
} from "@cosmjs/stargate";
import {
  MsgCreatePartEvent,
  MsgSetIncreasePart,
  MsgGetMoneyPart,
} from "./proto-ts/bettery/events/v1/tx";
import { OfflineAminoSigner } from "@keplr-wallet/types";

const registry = new Registry(defaultRegistryTypes);

registry.register("/bettery.events.v1.MsgCreatePartEvent", MsgCreatePartEvent);
registry.register("/bettery.events.v1.MsgSetIncreasePart", MsgSetIncreasePart);
registry.register("/bettery.events.v1.MsgGetMoneyPart", MsgGetMoneyPart);

const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_URL as string;

export const txParticipateEvent = async (
  signer: OfflineAminoSigner & OfflineDirectSigner,
  address: string,
  eventId: number,
  selectedAnswer: string,
  amount: bigint,
) => {
  if (!signer || !address) {
    throw new Error("Wallet not connected. Connect your Keplr wallet first.");
  }
  try {
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      signer,
      { registry, gasPrice: GasPrice.fromString("0ubet") },
    );
    const msg = {
      typeUrl: "/bettery.events.v1.MsgCreatePartEvent",
      value: MsgCreatePartEvent.fromPartial({
        creator: address,
        eventId,
        answers: selectedAnswer,
        amount: amount.toString(),
      }),
    };

    const result = await client.signAndBroadcast(address, [msg], "auto");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error txParticipateEvent in event");
    console.log(error);
  }
};

export const txIncreasePart = async (
  signer: OfflineAminoSigner & OfflineDirectSigner,
  address: string,
  partId: number,
  eventId: number,
  amount: bigint,
) => {
  if (!signer || !address) {
    throw new Error("Wallet not connected. Connect your Keplr wallet first.");
  }

  try {
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      signer,
      { registry, gasPrice: GasPrice.fromString("0ubet") },
    );
    const msg = {
      typeUrl: "/bettery.events.v1.MsgSetIncreasePart",
      value: MsgSetIncreasePart.fromPartial({
        creator: address,
        eventId,
        partId,
        amount: amount.toString(),
      }),
    };

    const result = await client.signAndBroadcast(address, [msg], "auto");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error txIncreasePart in event");
    console.log(error);
  }
};

export const getMoneyFromEvent = async (
  signer: OfflineAminoSigner & OfflineDirectSigner,
  address: string,
  eventId: string,
  partId: string,
) => {
  if (!signer || !address) {
    throw new Error("Wallet not connected. Connect your Keplr wallet first.");
  }
  try {
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      signer,
      { registry, gasPrice: GasPrice.fromString("0ubet") },
    );
    const msg = {
      typeUrl: "/bettery.events.v1.MsgGetMoneyPart",
      value: MsgGetMoneyPart.fromPartial({
        creator: address,
        eventId,
        partId,
      }),
    };
    const result = await client.signAndBroadcast(address, [msg], "auto");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error getMoneyFromEvent in event");
    console.log(error);
  }
};
