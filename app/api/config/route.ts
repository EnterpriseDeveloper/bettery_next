import { NextResponse } from "next/server";
import {
  getCreatorPercent,
  getCompanyPercent,
} from "@/blockchain/cosmos/config";

export const revalidate = 60;

export async function GET() {
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
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
