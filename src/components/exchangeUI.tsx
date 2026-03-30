"use client";

import React, { useState } from "react";
import { Loader } from "lucide-react";
import EntityProfile from "./Dashboards/EntityProfile";
import IntelSearch from "./Dashboards/IntelSearch";
import { useWhales } from "@/hooks/whales"; // Import the React Query hook

const ExchangeUI = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  // Fetch real whale data from API
  const { data: whales = [], isLoading, error } = useWhales();

  // Set first whale as default when data loads
  React.useEffect(() => {
    if (whales.length > 0 && !selectedAddress) {
      setSelectedAddress(whales[0].address);
    }
  }, [whales, selectedAddress]);

  const selectedWhale = whales.find((w) => w.address === selectedAddress) || whales[0];

  return (
    <div className="min-h-screen bg-[#f5ebe0] text-slate-900 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* SEARCH BAR */}
        <IntelSearch onSelectAddress={setSelectedAddress} />

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            Error loading whale data. Make sure HELIUS_API_KEY is configured in .env.local
          </div>
        )}

        {/* TOP SECTION: GLOBAL STATS & SELECTED WHALE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WHALE PROFILE CARD */}
          {isLoading ? (
            <div className="bg-white/70 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-md flex items-center justify-center h-full">
              <Loader size={32} className="animate-spin text-slate-400" />
            </div>
          ) : selectedWhale ? (
            <EntityProfile whale={selectedWhale} />
          ) : (
            <div className="bg-white/70 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-md">
              <p className="text-slate-400">No whale data available</p>
            </div>
          )}

          {/* STATS PANEL */}
          <div className="bg-white/60 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-md space-y-4">
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              Market Metrics
            </p>

            {/* Total TVL */}
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total TVL (All Whales)</p>
              <p className="text-3xl font-black text-slate-900">
                {isLoading ? "—" : `$${(whales.reduce((sum, w) => sum + w.usdValue, 0) / 1000000).toFixed(1)}M`}
              </p>
            </div>

            {/* Active Whales */}
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Active Whales</p>
              <p className="text-3xl font-black text-blue-600">{whales.length}</p>
            </div>

            {/* Average Risk Score */}
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Avg Risk Score</p>
              <p className="text-3xl font-black text-orange-600">
                {isLoading ? "—" : (whales.reduce((sum, w) => sum + w.riskScore, 0) / Math.max(1, whales.length)).toFixed(0)}
                <span className="text-lg">/100</span>
              </p>
            </div>
          </div>
        </div>

        {/* WHALE LEADERBOARD */}
        <div className="bg-white/50 border border-white shadow-xl rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            🐋 Top Whales
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={24} className="animate-spin text-slate-400" />
            </div>
          ) : whales.length > 0 ? (
            <div className="space-y-2">
              {whales.map((whale) => (
                <button
                  key={whale.address}
                  onClick={() => setSelectedAddress(whale.address)}
                  className={`w-full p-3 rounded-xl text-left transition ${
                    selectedAddress === whale.address
                      ? "bg-blue-100 border border-blue-400"
                      : "bg-white/30 border border-white hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{whale.label}</p>
                      <p className="text-xs text-slate-500">{whale.address.slice(0, 12)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">${(whale.usdValue / 1000000).toFixed(1)}M</p>
                      <p className={`text-xs font-bold ${
                        whale.riskScore > 50 ? "text-red-600" : whale.riskScore > 30 ? "text-orange-600" : "text-emerald-600"
                      }`}>
                        Risk: {whale.riskScore}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No whales found</p>
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white/50 border border-white shadow-xl rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            📊 Recent Activity
          </h3>

          {selectedWhale ? (
            <div className="space-y-2">
              <div className="p-3 bg-white/30 border border-white rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Last Active</p>
                <p className="font-bold text-slate-900">{selectedWhale.lastActive}</p>
              </div>
              <div className="p-3 bg-white/30 border border-white rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Total Transactions</p>
                <p className="font-bold text-slate-900">{selectedWhale.txCount}</p>
              </div>
              <div className="p-3 bg-white/30 border border-white rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Avg Transaction Size</p>
                <p className="font-bold text-slate-900">{selectedWhale.avgTxSize.toFixed(2)} SOL</p>
              </div>
              <div className="p-3 bg-white/30 border border-white rounded-lg">
                <p className="text-xs text-slate-500 mb-1">24h Change</p>
                <p className={`font-bold ${selectedWhale.changePercent > 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {selectedWhale.changePercent > 0 ? "+" : ""}{selectedWhale.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Select a whale to see activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeUI;