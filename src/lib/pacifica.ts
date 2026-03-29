// src/lib/pacifica.ts
const BASE_URL = 'https://api.pacifica.fi/v1'; 

export const getRecentTrades = async (symbol: string = 'ETH-USDC') => {
  try {
    // Adding 'no-cors' mode can sometimes bypass local blocks, 
    // but usually, we just need to handle the JSON correctly.
    const response = await fetch(`${BASE_URL}/market/trades?symbol=${symbol}&limit=20`);
    
    if (!response.ok) {
      console.warn("Pacifica API responded with an error status:", response.status);
      return [];
    }

    const json = await response.json();
    console.log("Raw Pacifica Data:", json); // This lets you see the structure in F12

    // This "Find the Array" logic is a pro-move for hackathons:
    if (Array.isArray(json)) return json;
    if (json.result && Array.isArray(json.result)) return json.result;
    if (json.data && Array.isArray(json.data)) return json.data;
    if (json.trades && Array.isArray(json.trades)) return json.trades;

    return [];
  } catch (error) {
    console.error("Connection to Pacifica failed:", error);
    return [];
  }
};