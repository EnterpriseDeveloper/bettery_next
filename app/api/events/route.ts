import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const address = searchParams.get("address") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)),
    );

    const where: {
      category?: string;
      status?: string;
      bets?: { some: { creator: string } };
    } = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (address) where.bets = { some: { creator: address } };

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { bets: true, validators: true },
      }),
      prisma.event.count({ where }),
    ]);

    return new NextResponse(
      JSON.stringify(
        { events, total, page, limit, totalPages: Math.ceil(total / limit) },
        (_, v) => (typeof v === "bigint" ? v.toString() : v),
      ),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
