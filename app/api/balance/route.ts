import { NextResponse } from "next/server";
import "../../../envConfig";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

import { StargateClient } from "@cosmjs/stargate";
import { formatUnits } from "viem";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    const client = await StargateClient.connect(rpcUrl as string);

    const balance = await client.getBalance(address, "ubet");
    console.log("Balance:", balance);
    const mybalance = formatUnits(BigInt(balance.amount), 6);

    return NextResponse.json(
      { balance: Number(mybalance).toFixed(2) },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting balance:", error);
    return NextResponse.json(
      { error: "Error getting balance" },
      { status: 500 },
    );
  }
}
