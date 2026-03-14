import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { QueryClientImpl } from "./proto-ts/bettery/funds/v1/query";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

export async function getCreatorPercent() {
  try {
    const tmClient = await Tendermint37Client.connect(rpcUrl as string);

    const queryClient = new QueryClient(tmClient);
    const rpcClient = createProtobufRpcClient(queryClient);

    const ownerQuery = new QueryClientImpl(rpcClient);

    const percent = await ownerQuery.GetCreatorPercent({});
    console.log("Creator Percent:", percent);
  } catch (e) {
    console.log("getOwner error");
    console.log(e);
  }
}

export async function getCompanyPercent() {
  try {
    const tmClient = await Tendermint37Client.connect(rpcUrl as string);

    const queryClient = new QueryClient(tmClient);
    const rpcClient = createProtobufRpcClient(queryClient);

    const ownerQuery = new QueryClientImpl(rpcClient);

    const percent = await ownerQuery.GetPercent({});
    console.log("Owner Percent:", percent);
  } catch (e) {
    console.log("getOwner error");
    console.log(e);
  }
}
