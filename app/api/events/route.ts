import { QueryClient } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { QueryClientImpl } from "../../../tx/proto-ts/bettery/events/v1/query";
import { createProtobufRpcClient } from "@cosmjs/stargate";
import { NextResponse } from "next/server";
import { Events } from "@/types/events";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "10");
  const creator = searchParams.get("creator");

  const nextKeyParam = searchParams.get("nextKey");
  const nextKey = nextKeyParam
    ? Uint8Array.from(Buffer.from(nextKeyParam, "base64"))
    : undefined;

  try {
    const tmClient = await Tendermint37Client.connect(rpcUrl as string);

    const queryClient = new QueryClient(tmClient);
    const rpcClient = createProtobufRpcClient(queryClient);

    const eventsQuery = new QueryClientImpl(rpcClient);

    const res = await eventsQuery.ListEvents({
      pagination: {
        limit: limit,
        key: nextKey ? nextKey : new Uint8Array(0),
        offset: 0,
        countTotal: true,
        reverse: true,
      },
    });

    const events: Events[] = res.events as Events[];

    if (creator) {
      for (const element of events) {
        const include = element.participants.includes(creator);
        if (include) {
          const partRes = await eventsQuery.ParticipantById({
            eventId: element.id,
            creator: creator,
          });
          if (partRes.participant) {
            partRes.participant.amount = Number(
              partRes.participant.amount / 1e6,
            );
            element.participant = partRes.participant;
          }
        }
      }
    }

    return NextResponse.json({
      events: events,
      nextKey: res.pagination?.nextKey
        ? Buffer.from(res.pagination.nextKey).toString("base64")
        : null,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
