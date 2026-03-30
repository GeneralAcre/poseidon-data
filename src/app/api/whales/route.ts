import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const { address } = params;
  
  // Clean the URL from .env.local (removing {address} placeholder if present)
  const baseUrl = process.env.HELIUS_ENHANCED_API?.replace('{address}', address);
  const apiKey = process.env.HELIUS_API_KEY?.split('=')[1]; // Extracts the key if you pasted the full URL

  if (!baseUrl) {
    return NextResponse.json({ error: "API URL not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}${apiKey}`);
    const txs = await response.json();

    // Helius returns an array of transactions. We'll calculate "Whale" stats from them.
    if (!Array.isArray(txs) || txs.length === 0) {
      return NextResponse.json({ error: "No transactions found for this address" }, { status: 404 });
    }

    // Logic to transform raw Helius data into your UI's 'WhaleData' format
    const totalValue = txs.reduce((acc: number, tx: any) => acc + (tx.nativeTransfers?.[0]?.amount || 0), 0);
    
    const whaleResult = {
      address: address,
      id: address.slice(0, 8),
      label: "Live Wallet Data",
      usdValue: (totalValue / 1e9) * 150, // Very rough SOL to USD estimate (adjust as needed)
      riskScore: txs.length > 50 ? 10 : 60, // More txs usually means a more "established" wallet
      type: "Direct Search",
      lastActive: "Recent",
      txCount: txs.length,
      avgTxSize: (totalValue / txs.length) / 1e9,
      changePercent: 0, 
      balance: 0, // Would need a separate 'getBalance' call for 100% accuracy
      tags: txs[0]?.type ? [txs[0].type] : ["Active"],
      holdingPeriod: "N/A"
    };

    return NextResponse.json(whaleResult);
  } catch (error) {
    console.error("Helius Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch from Helius" }, { status: 500 });
  }
}