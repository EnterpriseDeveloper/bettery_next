import { Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient, defaultRegistryTypes } from "@cosmjs/stargate";
import { MsgMintToken } from "./proto-ts/bettery/funds/v1/tx";

const registry = new Registry(defaultRegistryTypes);

registry.register("/bettery.funds.v1.MsgMintToken", MsgMintToken);

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "bettery";
