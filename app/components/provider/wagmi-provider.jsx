"use client";

import { WagmiProvider } from "wagmi";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

export function WagmiProviderComponent({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
