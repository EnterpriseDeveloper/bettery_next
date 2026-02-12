import { OfflineDirectSigner, Registry } from "@cosmjs/proto-signing";
import {
  GasPrice,
  SigningStargateClient,
  defaultRegistryTypes,
} from "@cosmjs/stargate";
import {
  MsgCreateEvent,
  MsgCreatePartEvent,
} from "./proto-ts/bettery/events/v1/tx";
import { OfflineAminoSigner } from "@keplr-wallet/types";
import { TxCreateEvent } from "@/types/events";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

const registry = new Registry(defaultRegistryTypes);

registry.register("/bettery.events.v1.MsgCreateEvent", MsgCreateEvent);
registry.register("/bettery.events.v1.MsgCreatePartEvent", MsgCreatePartEvent);

const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_URL as string;

export const txCreateEvent = async (
  signer: OfflineAminoSigner & OfflineDirectSigner,
  address: string,
  event: TxCreateEvent,
) => {
  try {
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      signer,
      { registry, gasPrice: GasPrice.fromString("0ubet") },
    );

    const msg = {
      typeUrl: "/bettery.events.v1.MsgCreateEvent",
      value: MsgCreateEvent.fromPartial({
        creator: address,
        question: event.question,
        answers: event.answers,
        endTime: event.end_time,
        category: event.category,
      }),
    };

    const result = await client.signAndBroadcast(address, [msg], "auto");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error creating event");
    console.log(error);
  }
};

export const txParticipateEvent = async (
  signer: OfflineAminoSigner & OfflineDirectSigner,
  address: string,
  eventId: number,
  selectedAnswer: string,
  amount: string,
) => {
  try {
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      signer,
      { registry, gasPrice: GasPrice.fromString("0ubet") },
    );
    const amountCoin: Coin = {
      denom: "ubet", // TODO: change to actual coin type
      amount: amount, // string!
    };
    const msg = {
      typeUrl: "/bettery.events.v1.MsgCreatePartEvent",
      value: MsgCreatePartEvent.fromPartial({
        creator: address,
        eventId,
        answers: selectedAnswer,
        amount: amountCoin,
      }),
    };

    const result = await client.signAndBroadcast(address, [msg], "auto");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error participating in event");
    console.log(error);
  }
};
