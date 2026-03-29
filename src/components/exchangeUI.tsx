"use client";
import React, { useState } from 'react'; // Added { useState } here
import EntityProfile from './Dashboards/EntityProfile'; 

const ExchangeUI = () => {
  // Now this will work perfectly on your ASUS TUF
  const [activeAddress, setActiveAddress] = useState("6EF8rS...3Z8P");

  return (
    <div className="min-h-screen bg-[#f5ebe0] text-slate-900 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP SECTION: GLOBAL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <EntityProfile address={activeAddress} />
           {/* Your Sentiment/VIS Gauge goes here */}
           <div className="bg-white/60 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-md">
             <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Market Intent</p>
             <h2 className="text-2xl font-black text-slate-900">LIQUIDITY FLOW</h2>
             {/* Placeholder for your Sentiment Chart */}
           </div>
        </div>

        {/* BOTTOM SECTION: LIVE FEED */}
        <div className="bg-white/50 border border-white shadow-xl rounded-3xl p-6 h-150 backdrop-blur-md">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Live Solana Intel</h3>
           {/* Your IntelFeed Table component goes here */}
        </div>
      </div>
    </div>
  );
};
export default ExchangeUI