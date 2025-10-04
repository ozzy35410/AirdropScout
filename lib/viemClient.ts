import { createPublicClient, defineChain, http, type PublicClient } from "viem";
import { CHAINS, type ChainSlug } from "@/config/chains";

type ClientCacheEntry = {
  client: PublicClient;
};

const clientCache = new Map<ChainSlug, ClientCacheEntry>();

export function getPublicClient(chain: ChainSlug): PublicClient {
  const cached = clientCache.get(chain);
  if (cached) return cached.client;

  const chainConfig = CHAINS[chain];
  const defined = defineChain({
    id: chainConfig.id,
    name: chainConfig.name,
    network: chainConfig.slug,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: {
      default: { http: [chainConfig.rpcUrl] },
      public: { http: [chainConfig.rpcUrl] }
    },
    blockExplorers: {
      default: {
        name: chainConfig.name,
        url: chainConfig.explorer
      }
    }
  });

  const client = createPublicClient({
    chain: defined,
    transport: http(chainConfig.rpcUrl, { timeout: 8_000 })
  });

  clientCache.set(chain, { client });
  return client;
}
