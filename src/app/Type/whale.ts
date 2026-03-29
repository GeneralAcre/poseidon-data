export type WhalePersona = 'The Arbitrageur' | 'The Panic Seller' | 'The Yield Farmer' | 'The Accumulator';

export interface WhaleWallet {
  address: string;
  persona: WhalePersona;
  historicalVolatilityImpact: number; // 0-100
  typicalSwapSize: number;
  preferredDEX: string[];
  lastAction: {
    type: 'buy' | 'sell' | 'transfer';
    amount: number;
    timestamp: number;
  };
}