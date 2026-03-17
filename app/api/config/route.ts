import { NextResponse } from "next/server";
import {
  getCreatorPercent,
  getCompanyPercent,
} from "@/blockchain/cosmos/config";

export const revalidate = 60;

const ENABLE_APP =
  process.env.NEXT_PUBLIC_ENABLE_APP === "true" ||
  process.env.ENABLE_CONFIG_RPC === "true";

export async function GET() {
  if (!ENABLE_APP) {
    // In disabled mode, avoid RPC calls and just return nulls.
    return NextResponse.json({
      creatorPercent: null,
      companyPercent: null,
    });
  }

  try {
    const [creatorPercent, companyPercent] = await Promise.all([
      getCreatorPercent(),
      getCompanyPercent(),
    ]);
    return NextResponse.json({
      creatorPercent,
      companyPercent,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load config";
    console.error("API config error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
