import { http, createConfig } from "wagmi";
import { monadTestnet } from "viem/chains";
import { injected } from "wagmi/connectors";

export const COORDINATOR_ADDRESS = "0x15d0B0720453afe9d03831996276A44e8b202dDD";
export const PAYMENT_AMOUNT = "0.005";

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [injected()],
  transports: {
    [monadTestnet.id]: http(),
  },
});
