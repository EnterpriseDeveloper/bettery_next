import { Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient, defaultRegistryTypes } from "@cosmjs/stargate";

import { MsgMintToken } from "./proto-ts/bettery/funds/v1/tx";

const registry = new Registry(defaultRegistryTypes);

registry.register("/bettery.funds.v1.MsgMintToken", MsgMintToken);

const chainId = "bettery-1";

await window.keplr.enable(chainId);

const offlineSigner = window.keplr.getOfflineSigner(chainId);
const accounts = await offlineSigner.getAccounts();
const address = accounts[0].address;
