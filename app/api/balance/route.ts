import { NextResponse } from "next/server";
import "../../../envConfig";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

import { StargateClient } from "@cosmjs/stargate";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    const client = await StargateClient.connect(rpcUrl as string);

    const balance = await client.getBalance(address, "ubet");

    return NextResponse.json({ balance: balance.amount }, { status: 200 });
  } catch (error) {
    console.error("Error getting balance:", error);
    return NextResponse.json(
      { error: "Error getting balance" },
      { status: 500 },
    );
  }
}
