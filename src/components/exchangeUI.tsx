"use client";

import React, { useEffect, useState } from 'react';
import { getRecentTrades } from '@/lib/pacifica';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const ExchangeUI = () => {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecentTrades('ETH-USDC');
      setTrades(data || []);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fix: Move chartData INSIDE the component so it can see 'trades'
  const chartData = trades.map((t: any, index: number) => ({
    time: index,
    price: parseFloat(t.price) || 0
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-mono">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            Poseidon’s Eye Visualizer
          </h2>
          
          <div className="h-80 w-full bg-slate-950/50 rounded-lg border border-slate-800 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Intent Feed Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-fit">
          <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Live Intent Feed</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {trades.length > 0 ? trades.map((trade: any, i: number) => (
              <IntentRow 
                key={i}
                wallet={trade.id?.toString().substring(0, 8) || "0x..."}
                action={trade.side === 'buy' ? 'LONG' : 'SHORT'}
                amount={`${trade.size} ETH`}
                time="LIVE"
                impact={parseFloat(trade.size) > 10 ? 'Critical' : 'Medium'}
                color={trade.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'}
              />
            )) : (
              <div className="text-slate-600 italic text-center py-10">Connecting to Pacifica API...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const IntentRow = ({ wallet, action, amount, time, impact, color }: any) => (
  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-600 transition-all">
    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
      <span>{wallet}</span>
      <span className={`font-bold uppercase ${color}`}>{impact}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold">{action} <span className="text-slate-400">{amount}</span></span>
      <span className="text-[10px] text-slate-600">{time}</span>
    </div>
  </div>
);

export default ExchangeUI;