import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, type Address } from "viem";
import { CHAINS, type ChainSlug } from "@/config/chains";
import { isValidAddress, normalizeAddress } from "@/lib/address";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, { data: any; timestamp: number }>();

type TransactionType = "transfer" | "contract" | "mint";

interface WalletStats {
  overview: {
    totalTransactions: number;
    sentTransactions: number;
    receivedTransactions: number;
    uniqueContracts: number;
    contractsDeployed: number;
    totalVolume: string;
    totalFees: string;
    currentBalance: string;
    nftMints: {
      unique: number;
      total: number;
    };
    uniqueTokens: number;
    lastActivity: string | null;
    firstActivity: string | null;
    activeDays: number;
  };
  recentTransactions: Array<{
    hash: string;
    timestamp: number;
    from: string;
    to: string | null;
    value: string;
    type: TransactionType;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { chain: string } }
) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const chainSlug = params.chain as ChainSlug;

  // Validation
  if (!address || !isValidAddress(address)) {
    return NextResponse.json(
      { ok: false, error: "Invalid address" },
      { status: 400 }
    );
  }

  const chain = CHAINS[chainSlug];
  if (!chain) {
    return NextResponse.json(
      { ok: false, error: "Invalid chain" },
      { status: 400 }
    );
  }

  const normalizedAddress = normalizeAddress(address) as Address;
  const cacheKey = `${chainSlug}:${normalizedAddress}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      ok: true,
      stats: cached.data,
      meta: {
        elapsedMs: Date.now() - startTime,
        cached: true,
        chain: chainSlug
      }
    });
  }

  try {
    const client = createPublicClient({
      chain: {
        id: chain.id,
        name: chain.name,
        network: chain.slug,
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: {
          default: { http: [chain.rpcUrl] },
          public: { http: [chain.rpcUrl] }
        }
      },
      transport: http(chain.rpcUrl, {
        timeout: 15_000,
        retryCount: 2
      })
    });

    // Get current balance
    const balance = await client.getBalance({ address: normalizedAddress });

    // Get current block
    const currentBlock = await client.getBlockNumber();

    // Get transaction count
    const txCount = await client.getTransactionCount({
      address: normalizedAddress,
      blockTag: "latest"
    });

    // Fetch recent blocks with transactions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blockPromises: Promise<any>[] = [];
    const blocksToCheck = 20; // Last 20 blocks
    
    for (let i = 0; i < blocksToCheck && currentBlock - BigInt(i) > 0n; i++) {
      blockPromises.push(
        client.getBlock({
          blockNumber: currentBlock - BigInt(i),
          includeTransactions: true
        }).catch(() => null)
      );
    }

    const blocks = (await Promise.all(blockPromises)).filter(Boolean);
    
    // Process transactions
    const recentTransactions: WalletStats["recentTransactions"] = [];
    const uniqueContracts = new Set<string>();
    let sentCount = 0;
    let receivedCount = 0;
    let totalVolume = 0n;
    let totalFees = 0n;
    let lastActivity: number | null = null;
    let firstActivity: number | null = null;

    for (const block of blocks) {
      if (!block || !block.transactions) continue;

      for (const tx of block.transactions) {
        if (typeof tx === "string") continue;

        const isSender = tx.from.toLowerCase() === normalizedAddress.toLowerCase();
        const isReceiver = tx.to?.toLowerCase() === normalizedAddress.toLowerCase();

        if (!isSender && !isReceiver) continue;

        if (isSender) sentCount++;
        if (isReceiver) receivedCount++;

        const timestamp = Number(block.timestamp);
        if (!lastActivity || timestamp > lastActivity) lastActivity = timestamp;
        if (!firstActivity || timestamp < firstActivity) firstActivity = timestamp;

        if (tx.to) {
          uniqueContracts.add(tx.to.toLowerCase());
        }

        const value = tx.value || 0n;
        totalVolume += value;

        // Estimate fees (simplified)
        const gasUsed = BigInt(tx.gas || 21000n);
        const gasPrice = BigInt(tx.gasPrice || 0n);
        totalFees += gasUsed * gasPrice;

        // Determine transaction type
        let txType: TransactionType = "transfer";
        if (!tx.to) {
          txType = "contract"; // Contract deployment
        } else if (tx.input && tx.input !== "0x" && tx.input.length > 10) {
          txType = "contract"; // Contract interaction
        }

        if (recentTransactions.length < 10) {
          recentTransactions.push({
            hash: tx.hash,
            timestamp,
            from: tx.from,
            to: tx.to || null,
            value: value.toString(),
            type: txType
          });
        }
      }
    }

    const stats: WalletStats = {
      overview: {
        totalTransactions: Number(txCount),
        sentTransactions: sentCount,
        receivedTransactions: receivedCount,
        uniqueContracts: uniqueContracts.size,
        contractsDeployed: 0, // Would need more complex logic
        totalVolume: totalVolume.toString(),
        totalFees: totalFees.toString(),
        currentBalance: balance.toString(),
        nftMints: {
          unique: 0, // Would need ERC-721/1155 event parsing
          total: 0
        },
        uniqueTokens: 0, // Would need ERC-20 event parsing
        lastActivity: lastActivity ? new Date(lastActivity * 1000).toISOString() : null,
        firstActivity: firstActivity ? new Date(firstActivity * 1000).toISOString() : null,
        activeDays: 0 // Would need more historical data
      },
      recentTransactions: recentTransactions.sort((a, b) => b.timestamp - a.timestamp)
    };

    // Cache the result
    cache.set(cacheKey, { data: stats, timestamp: Date.now() });

    return NextResponse.json({
      ok: true,
      stats,
      meta: {
        elapsedMs: Date.now() - startTime,
        cached: false,
        chain: chainSlug
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Wallet stats error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Failed to fetch wallet stats",
        meta: {
          elapsedMs: Date.now() - startTime,
          chain: chainSlug
        }
      },
      { status: 500 }
    );
  }
}
