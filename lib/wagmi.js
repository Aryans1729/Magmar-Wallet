import { http, createConfig } from "wagmi";
import { mainnet, bsc, base } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, base],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
  },
});
