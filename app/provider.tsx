"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "@/blockchain/evm/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useConfigStore } from "@/store/useConfigStore";

const queryClient = new QueryClient();

function ConfigHydrator() {
  const fetchConfig = useConfigStore((s) => s.fetchConfig);
  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConfigHydrator />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
