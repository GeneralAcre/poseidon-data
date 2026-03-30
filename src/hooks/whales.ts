import { useQuery } from "@tanstack/react-query";

export interface WhaleData {
  address: string;
  label: string;
  usdValue: number;
  riskScore: number;
  type: string;
  lastActive: string;
  txCount: number;
  avgTxSize: number;
  changePercent: number;
  // Add these missing fields:
  id: string;
  balance: number;
  tags: string[];
  holdingPeriod: string;
}

// Hook for fetching the list of top whales
export const useWhales = () => {
  return useQuery<WhaleData[]>({
    queryKey: ["whales"],
    queryFn: async () => {
      const response = await fetch("/api/whales");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    // Refresh data every 30 seconds
    refetchInterval: 30000,
  });
};

// Hook for searching a specific whale address
export const useSearchWhale = (address: string) => {
  return useQuery<WhaleData | null>({
    queryKey: ["whale-search", address],
    queryFn: async () => {
      if (!address || address.length < 32) return null;
      
      const response = await fetch(`/api/whales/${address}`);
      if (!response.ok) {
        throw new Error("Whale not found");
      }
      return response.json();
    },
    enabled: address.length > 32, // Only run when a full address is typed
    retry: false,
  });
};