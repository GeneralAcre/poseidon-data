/**
 * POSEIDON'S EYE - Backend API Routes (Enhanced Helius APIs)
 * File: app/api/whales/[...route]/route.ts
 * 
 * Uses Helius Enhanced APIs instead of raw RPC:
 * - Pre-parsed transactions
 * - Better structured data
 * - Faster whale tracking
 */

import { NextRequest, NextResponse } from "next/server";

// ==================== CONFIGURATION ====================

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_ENHANCED_API = "https://api-mainnet.helius-rpc.com/v0";

if (!HELIUS_API_KEY) {
  console.error("❌ HELIUS_API_KEY not found in .env.local");
}

// ==================== TYPE DEFINITIONS ====================

interface WhaleEntity {
  id: string;
  address: string;
  label: string;
  type: string;
  balance: number;
  usdValue: number;
  riskScore: number;
  tags: string[];
  lastActive: string;
  changePercent: number;
  txCount: number;
  avgTxSize: number;
  holdingPeriod: string;
}

interface EnhancedTransaction {
  signature: string;
  blockTime: number;
  type: string;
  source: string;
  destination: string;
  tokenTransfers: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    mint: string;
  }>;
  nativeTransfers: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    lamports: number;
  }>;
  fee: number;
  feePayer: string;
  status: "Success" | "Failed";
}

// ==================== MAIN ROUTE HANDLER ====================

export async function GET(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  try {
    const [endpoint] = params.route;
    const searchParams = request.nextUrl.searchParams;

    // Route: /api/whales/list
    if (endpoint === "list") {
      const whales = await getTopWhales();
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: whales,
      });
    }

    // Route: /api/whales/search?q=address_or_label
    if (endpoint === "search") {
      const query = searchParams.get("q");
      if (!query) {
        return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
      }

      const whale = await searchWhale(query);
      if (!whale) {
        return NextResponse.json({ error: "Whale not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: whale,
      });
    }

    // Route: /api/whales/activity?address=optional
    if (endpoint === "activity") {
      const address = searchParams.get("address");
      const activities = await getActivityFeed(address || undefined);
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: activities,
      });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// ==================== MAIN FUNCTIONS ====================

/**
 * Fetch top active whales
 */
async function getTopWhales(): Promise<WhaleEntity[]> {
  const topHolderAddresses = [
    "5Q544fKrFoe6tsEbD7K5wWb4d4kWDwy51DRwWP8qQ8T",
    "J7Bw3PZt2qkLm9xR3vWn2eQp5sKj4dFm1aB6cH8nQ9Y",
    "7pJ2X8nK5vQ3mR6wY9tL2eH4aS1bF8cD5gP9nK3jL",
    "9kL5mW2nV7pQ8xR3sY1zA4cB6dE7fG9hI2jK4lM",
    "6eJrEjP1Qq2Xx3Zz9aW5sD8kL0mN1vC6bF4pG7hJ",
  ];

  const whales = await Promise.all(
    topHolderAddresses.map((addr) =>
      fetchWhaleProfile(addr).catch((err) => {
        console.error(`Failed to fetch whale ${addr}:`, err);
        return null;
      })
    )
  );

  return whales.filter((w) => w !== null) as WhaleEntity[];
}

/**
 * Search for a whale by address
 */
async function searchWhale(query: string): Promise<WhaleEntity | null> {
  try {
    if (query.length > 30) {
      return await fetchWhaleProfile(query);
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Get activity feed from Enhanced API
 */
async function getActivityFeed(address?: string) {
  if (!address) return [];

  try {
    const transactions = await fetchEnhancedTransactionHistory(address, 20);

    return transactions.map((tx) => {
      const tokenTransfer = tx.tokenTransfers?.[0];
      const nativeTransfer = tx.nativeTransfers?.[0];

      if (tokenTransfer) {
        return {
          id: tx.signature,
          whale: address.slice(0, 8),
          action: "swap",
          from: `${tokenTransfer.tokenAmount.toFixed(2)} ${tokenTransfer.mint.slice(0, 8)}`,
          to: tokenTransfer.toUserAccount.slice(0, 8),
          usdValue: Math.round(tokenTransfer.tokenAmount * 50), // Mock USD conversion
          timestamp: formatTimestamp(tx.blockTime),
          status: tx.status === "Success" ? "success" : "failed",
        };
      }

      if (nativeTransfer) {
        const sol = nativeTransfer.lamports / 1e9;
        return {
          id: tx.signature,
          whale: address.slice(0, 8),
          action: "transfer",
          from: `${sol.toFixed(2)} SOL`,
          to: nativeTransfer.toUserAccount.slice(0, 8),
          usdValue: Math.round(sol * 186),
          timestamp: formatTimestamp(tx.blockTime),
          status: tx.status === "Success" ? "success" : "failed",
        };
      }

      return null;
    }).filter(Boolean);
  } catch (error) {
    console.error("Error fetching activity feed:", error);
    return [];
  }
}

// ==================== CORE LOGIC ====================

/**
 * Fetch whale profile using Enhanced APIs
 */
async function fetchWhaleProfile(address: string): Promise<WhaleEntity> {
  // Fetch transactions using Enhanced API
  const transactions = await fetchEnhancedTransactionHistory(address, 50);

  if (!transactions || transactions.length === 0) {
    throw new Error(`No transaction history found for ${address}`);
  }

  // Calculate balance from native transfers
  let totalSolReceived = 0;
  let totalSolSent = 0;

  transactions.forEach((tx) => {
    tx.nativeTransfers?.forEach((transfer) => {
      if (transfer.toUserAccount === address) {
        totalSolReceived += transfer.lamports / 1e9;
      }
      if (transfer.fromUserAccount === address) {
        totalSolSent += transfer.lamports / 1e9;
      }
    });
  });

  const balanceSOL = totalSolReceived - totalSolSent;
  const usdValue = Math.round(balanceSOL * 186);

  // Analyze transactions for behavior
  const riskScore = calculateRiskScore(transactions, balanceSOL);
  const tags = classifyBehavior(transactions, balanceSOL);
  const lastActive = formatTimestamp(transactions[0]?.blockTime);
  const changePercent = calculateChangePercent(transactions);
  const holdingPeriod = estimateHoldingPeriod(transactions);
  const whaleType = classifyWhaleType(balanceSOL, riskScore, tags);
  const label = generateLabel(address, whaleType);

  return {
    id: `whale_${address.slice(0, 8)}`,
    address,
    label,
    type: whaleType,
    balance: parseFloat(balanceSOL.toFixed(2)),
    usdValue,
    riskScore,
    tags,
    lastActive,
    changePercent,
    txCount: transactions.length,
    avgTxSize: parseFloat((balanceSOL / Math.max(1, transactions.length)).toFixed(2)),
    holdingPeriod,
  };
}

/**
 * Fetch transaction history using Helius Enhanced API
 * Much cleaner than raw RPC - pre-parsed!
 */
async function fetchEnhancedTransactionHistory(
  address: string,
  limit: number = 50
): Promise<EnhancedTransaction[]> {
  if (!HELIUS_API_KEY) {
    throw new Error("HELIUS_API_KEY not configured");
  }

  try {
    const url = `${HELIUS_ENHANCED_API}/addresses/${address}/transactions/?api-key=${HELIUS_API_KEY}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const data = await response.json();

    // Helius returns transactions in an array
    return data || [];
  } catch (error) {
    console.error(`Error fetching transaction history for ${address}:`, error);
    throw error;
  }
}

/**
 * Calculate risk score based on transaction patterns
 */
function calculateRiskScore(transactions: EnhancedTransaction[], balance: number): number {
  let score = 50;

  // Factor 1: Transaction frequency
  const successfulTxs = transactions.filter((tx) => tx.status === "Success").length;
  if (successfulTxs > 5) score -= 15;
  if (successfulTxs < 2) score += 10;

  // Factor 2: Failed transactions
  const failedTxs = transactions.filter((tx) => tx.status === "Failed").length;
  if (failedTxs > 2) score += 15;

  // Factor 3: Transaction size volatility
  const txSizes = transactions
    .map((tx) => {
      let size = 0;
      tx.nativeTransfers?.forEach((t) => {
        size += t.lamports / 1e9;
      });
      return size;
    })
    .filter((s) => s > 0);

  if (txSizes.length > 0) {
    const avgSize = txSizes.reduce((a, b) => a + b) / txSizes.length;
    if (avgSize > balance * 0.5) score += 20;
    if (avgSize < balance * 0.1) score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Classify whale behavior
 */
function classifyBehavior(transactions: EnhancedTransaction[], balance: number): string[] {
  const tags: string[] = [];

  // Size classification
  if (balance > 10000) tags.push("Mega Whale");
  else if (balance > 1000) tags.push("Macro Whale");
  else if (balance > 100) tags.push("Micro Whale");

  // Activity classification
  if (transactions.length > 100) tags.push("High Frequency");
  else if (transactions.length < 10) tags.push("Passive Holder");

  // Pattern classification
  const avgTx = transactions
    .map((tx) => {
      let sum = 0;
      tx.nativeTransfers?.forEach((t) => (sum += t.lamports / 1e9));
      return sum;
    })
    .reduce((a, b) => a + b, 0) / transactions.length;

  if (avgTx > balance * 0.3) tags.push("High Volatility");
  else tags.push("Steady Accumulator");

  return tags.slice(0, 3);
}

/**
 * Classify whale type
 */
function classifyWhaleType(balance: number, riskScore: number, tags: string[]): string {
  if (balance > 50000) return "Institutional Fund";
  if (riskScore > 70) return "Trading Desk";
  if (tags.includes("High Frequency")) return "Arbitrage Bot";
  if (balance > 1000) return "Large Holder";
  return "Active Trader";
}

/**
 * Generate whale label
 */
function generateLabel(address: string, type: string): string {
  const labels = [
    "Solana Leviathan",
    "Phantom Executor",
    "Protocol Sentinel",
    "Darkpool Dealer",
    "Marinade Maverick",
    "Raydium Runner",
    "Magic Eden Mapper",
    "Jupiter Juggler",
    "Serum Shark",
    "Orca Operator",
  ];

  const hash = address.charCodeAt(0) + address.charCodeAt(address.length - 1);
  return labels[hash % labels.length];
}

/**
 * Format blockchain timestamp
 */
function formatTimestamp(blockTime: number | undefined): string {
  if (!blockTime) return "Unknown";

  const date = new Date(blockTime * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;

  return date.toLocaleDateString();
}

/**
 * Calculate change percentage
 */
function calculateChangePercent(transactions: EnhancedTransaction[]): number {
  if (transactions.length < 2) return 0;

  const oldestTx = transactions[transactions.length - 1];
  const newestTx = transactions[0];

  const oldestAmount = oldestTx.nativeTransfers?.[0]?.lamports / 1e9 || 0;
  const newestAmount = newestTx.nativeTransfers?.[0]?.lamports / 1e9 || 0;

  if (oldestAmount === 0) return 0;
  return ((newestAmount - oldestAmount) / oldestAmount) * 100;
}

/**
 * Estimate holding period
 */
function estimateHoldingPeriod(transactions: EnhancedTransaction[]): string {
  if (transactions.length === 0) return "Unknown";

  const oldestTx = transactions[transactions.length - 1];
  if (!oldestTx?.blockTime) return "Unknown";

  const months = Math.floor(
    (Date.now() / 1000 - oldestTx.blockTime) / (30 * 24 * 60 * 60)
  );

  if (months < 1) return "< 1 month";
  if (months < 12) return `${months} months`;

  const years = Math.floor(months / 12);
  return `${years}+ years`;
}

// ==================== EXPORT ====================

export const config = {
  maxDuration: 30,
};