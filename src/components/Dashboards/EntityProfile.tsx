"use client";

import React from "react";
import {
  User,
  ShieldCheck,
  Activity,
  Database,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

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

interface EntityProfileProps {
  whale: WhaleEntity;
}

const EntityProfile: React.FC<EntityProfileProps> = ({ whale }) => {
  // Determine risk badge color
  let riskColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
  let riskLabel = "Low Risk";

  if (whale.riskScore > 50) {
    riskColor = "bg-red-50 text-red-600 border-red-100";
    riskLabel = "High Risk";
  } else if (whale.riskScore > 30) {
    riskColor = "bg-orange-50 text-orange-600 border-orange-100";
    riskLabel = "Medium Risk";
  }

  return (
    <div className="bg-white/70 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-md flex flex-col h-full">
      {/* HEADER SECTION */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <User size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                {whale.label}
              </h3>
              <ShieldCheck size={16} className="text-blue-600" />
            </div>
            <p className="text-[10px] font-mono text-slate-400 truncate w-32 md:w-48">
              {whale.address}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase whitespace-nowrap ${riskColor}`}>
          {riskLabel}
        </span>
      </div>

      {/* INTEL GRID */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white/50 border border-white rounded-2xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Balance</p>
          <p className="text-lg font-black text-slate-900 leading-none">
            {whale.balance.toLocaleString()} SOL
          </p>
          <p className="text-xs text-slate-500 mt-1">{(whale.balance * 0.5).toFixed(0)} SOL avg tx</p>
        </div>
        <div className="p-4 bg-white/50 border border-white rounded-2xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">USD Net Worth</p>
          <p className="text-lg font-black text-blue-600 leading-none">
            ${(whale.usdValue / 1000000).toFixed(1)}M
          </p>
          <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${
            whale.changePercent > 0 ? "text-emerald-600" : "text-red-600"
          }`}>
            {whale.changePercent > 0 ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {whale.changePercent > 0 ? "+" : ""}{whale.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* WHALE TYPE & RISK SCORE */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Type</p>
          <p className="text-sm font-black text-slate-900">{whale.type}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Risk Score</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-slate-900">{whale.riskScore}/100</p>
            <AlertCircle size={14} className={
              whale.riskScore > 50 ? "text-red-600" : whale.riskScore > 30 ? "text-orange-600" : "text-emerald-600"
            } />
          </div>
        </div>
      </div>

      {/* RISK SCORE BAR */}
      <div className="mb-6">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              whale.riskScore > 50
                ? "bg-red-500"
                : whale.riskScore > 30
                ? "bg-orange-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${whale.riskScore}%` }}
          />
        </div>
      </div>

      {/* BEHAVIORAL TAGS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {whale.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200 uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ADDITIONAL STATS */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-500 font-bold uppercase">Transaction Count</span>
          <span className="font-black text-slate-900">{whale.txCount}</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-500 font-bold uppercase">Avg Tx Size</span>
          <span className="font-black text-slate-900">{whale.avgTxSize.toFixed(2)} SOL</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-500 font-bold uppercase">Holding Period</span>
          <span className="font-black text-slate-900">{whale.holdingPeriod}</span>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
        <div className="flex items-center gap-1.5 uppercase">
          <Activity size={12} />
          Last Seen: {whale.lastActive}
        </div>
        <div className="flex items-center gap-1.5 uppercase">
          <Database size={12} />
          Mainnet
        </div>
      </div>
    </div>
  );
};

export default EntityProfile;