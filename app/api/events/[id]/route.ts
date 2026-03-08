import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = BigInt(id);

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { bets: true, validators: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return new NextResponse(
      JSON.stringify(event, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      ),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
