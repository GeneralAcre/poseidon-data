"use client";

import React, { useState } from "react";
import { Search, Loader, AlertCircle } from "lucide-react";
import { useSearchWhale } from "@/hooks/whales";

interface IntelSearchProps {
  onSelectAddress: (address: string) => void;
}

const IntelSearch: React.FC<IntelSearchProps> = ({ onSelectAddress }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Search hook - only triggers if input is valid address length
  const { data: searchResult, isLoading, error } = useSearchWhale(searchInput);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setShowResults(value.length > 10); // Show results if input is long enough
  };

  const handleSelectWhale = (address: string) => {
    onSelectAddress(address);
    setSearchInput("");
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="bg-white/60 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-md">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
          Search Whale Address
        </label>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

          <input
            type="text"
            placeholder="Paste Solana address or search... (e.g., 5Q544fKr...)"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white/50 border border-white placeholder-slate-400 text-slate-900 font-mono text-sm rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-blue-400 transition"
          />

          {isLoading && (
            <Loader className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={18} />
          )}
        </div>

        {/* SEARCH RESULTS DROPDOWN */}
        {showResults && searchInput && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-white rounded-2xl shadow-lg p-4 z-50 backdrop-blur-md">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader className="animate-spin text-slate-400" size={20} />
                <span className="ml-3 text-slate-500 text-sm">Searching...</span>
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 py-4 px-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600 mt-0.5" size={16} />
                <div>
                  <p className="text-red-700 font-bold text-sm">Whale not found</p>
                  <p className="text-red-600 text-xs mt-1">Check the address and try again</p>
                </div>
              </div>
            ) : searchResult ? (
              <button
                onClick={() => handleSelectWhale(searchResult.address)}
                className="w-full p-4  from-blue-50 to-slate-50 border border-blue-200 hover:from-blue-100 hover:to-slate-100 rounded-lg transition text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-slate-900">{searchResult.label}</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      {searchResult.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-600">
                      ${(searchResult.usdValue / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{searchResult.type}</p>
                  </div>
                </div>
              </button>
            ) : (
              <p className="text-slate-500 text-sm py-4">No results</p>
            )}
          </div>
        )}
      </div>

      {/* QUICK TIPS */}
      <p className="text-[9px] text-slate-500 mt-3 font-mono">
        💡 Paste a full Solana address (e.g., 5Q544fKrFoe6tsEbD7K5...) to search whale data
      </p>
    </div>
  );
};

export default IntelSearch;
