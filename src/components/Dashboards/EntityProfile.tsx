"use client";

import React from 'react';
import { User, ShieldCheck, Activity, Database } from 'lucide-react';

const EntityProfile = ({ address }: { address: string }) => {
  // Mock data - in a real app, this comes from your Solana 'lib' logic
  const whaleData = {
    label: "Solana Leviathan",
    type: "Institutional Fund",
    balance: "45,200.50 SOL",
    netWorth: "$8,420,000",
    tags: ["High Conviction", "DEX LP", "SOL Native"],
    lastActive: "2 mins ago"
  };

  return (
    <div className="bg-white/70 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-md flex flex-col h-full">
      {/* HEADER SECTION */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <User size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{whaleData.label}</h3>
              <ShieldCheck size={16} className="text-blue-600" />
            </div>
            <p className="text-[10px] font-mono text-slate-400 truncate w-32 md:w-48">{address}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase">
          {whaleData.type}
        </span>
      </div>

      {/* INTEL GRID */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white/50 border border-white rounded-2xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Balance</p>
          <p className="text-lg font-black text-slate-900 leading-none">{whaleData.balance}</p>
        </div>
        <div className="p-4 bg-white/50 border border-white rounded-2xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">USD Net Worth</p>
          <p className="text-lg font-black text-blue-600 leading-none">{whaleData.netWorth}</p>
        </div>
      </div>

      {/* BEHAVIORAL TAGS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {whaleData.tags.map((tag) => (
          <span key={tag} className="text-[9px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200 uppercase">
            {tag}
          </span>
        ))}
      </div>

      {/* FOOTER STATS */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
        <div className="flex items-center gap-1.5 uppercase">
          <Activity size={12} />
          Last Seen: {whaleData.lastActive}
        </div>
        <div className="flex items-center gap-1.5 uppercase">
          <Database size={12} />
          Mainnet-Beta
        </div>
      </div>
    </div>
  );
};

export default EntityProfile;