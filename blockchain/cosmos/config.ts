import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { QueryClientImpl } from "./proto-ts/bettery/funds/v1/query";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

export async function getCreatorPercent(): Promise<number | null> {
  try {
    if (!rpcUrl) return null;
    const tmClient = await Tendermint37Client.connect(rpcUrl);
    const queryClient = new QueryClient(tmClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const ownerQuery = new QueryClientImpl(rpcClient);
    const res = await ownerQuery.GetCreatorPercent({});
    return res.percent ?? null;
  } catch (e) {
    console.error("getCreatorPercent error", e);
    return null;
  }
}

export async function getCompanyPercent(): Promise<number | null> {
  try {
    if (!rpcUrl) return null;
    const tmClient = await Tendermint37Client.connect(rpcUrl);
    const queryClient = new QueryClient(tmClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const ownerQuery = new QueryClientImpl(rpcClient);
    const res = await ownerQuery.GetPercent({});
    return res.percent ?? null;
  } catch (e) {
    console.error("getCompanyPercent error", e);
    return null;
  }
}
