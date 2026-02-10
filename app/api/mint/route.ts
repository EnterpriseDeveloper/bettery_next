import { NextResponse } from "next/server";
import "../../../envConfig";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import {
  defaultRegistryTypes as defaultStargateTypes,
  GasPrice,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { MsgMintToken } from "../../../tx/proto-ts/bettery/funds/v1/tx";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
const memo = process.env.MEMO;

export async function POST(request: Request) {
  try {
    const myRegistry = new Registry(defaultStargateTypes);
    myRegistry.register("/bettery.funds.v1.MsgMintToken", MsgMintToken);

    const signer = await DirectSecp256k1HdWallet.fromMnemonic(memo as string, {
      prefix: "bettery",
    });
    const client = await SigningStargateClient.connectWithSigner(
      rpcUrl as string,
      signer,
      { registry: myRegistry, gasPrice: GasPrice.fromString("0ubet") },
    );
    const { address } = await request.json();
    const creator = (await signer.getAccounts())[0].address;

    const msg = {
      typeUrl: "/bettery.funds.v1.MsgMintToken",
      value: {
        creator: creator,
        receiver: address,
      },
    };
    const result = await client.signAndBroadcast(creator, [msg], "auto");
    const buf = result.msgResponses[0].value;
    const value = new TextDecoder().decode(buf);
    console.log("Mint token result:", value);
    return NextResponse.json({ answer: value }, { status: 201 });
  } catch (error) {
    console.error("Error minting token:", error);
    return NextResponse.json(
      { error: "Failed to mint token" },
      { status: 500 },
    );
  }
}
