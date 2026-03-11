import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon } from "wagmi/chains";
import { defineChain } from "viem";

export const polygonAmoy = defineChain({
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: {
    name: "POL",
    symbol: "POL",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
  },
  blockExplorers: {
    default: {
      name: "PolygonScan",
      url: "https://amoy.polygonscan.com",
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: "BetMe",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  chains: [polygon, polygonAmoy],
  ssr: true,
});
