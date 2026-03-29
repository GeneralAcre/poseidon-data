"use client";

import React from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <main className="min-h-screen bg-[#f5ebe0] text-slate-900 flex flex-col font-sans relative overflow-hidden">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <div className="w-[80%] h-[80%] bg-blue-400/20 rounded-full blur-[160px] animate-pulse"></div>
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 grow flex flex-col">
        
        {/* HEADER */}
        <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-slate-900/10 rounded-full border border-slate-900/20"></span>
            <span className="font-bold text-lg tracking-tight">Pacifica</span>
            <span className="text-slate-400 font-light">/</span>
            <span className="font-medium text-slate-600">Poseidon’s Eye</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Docs</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Ecosystem</a>
            <button 
              onClick={onLaunch}
              className="px-6 py-2 bg-slate-900 text-white font-semibold rounded-full hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
            >
              Launch App
            </button>
          </nav>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="grow flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 max-w-7xl mx-auto w-full">
            
            {/* LEFT COLUMN */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="bg-white/40 border border-white backdrop-blur-lg p-10 md:p-14 rounded-3xl shadow-xl space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-slate-900">
                  Visualize <span className="text-blue-600">Institutional</span> Intent
                </h1>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/40 border border-white text-center hover:bg-white/60 group transition-all cursor-pointer shadow-sm">
                  <span className="font-bold text-slate-800 group-hover:text-blue-600">Docs & API</span>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Trade History</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/40 border border-white text-center hover:bg-white/60 group transition-all cursor-pointer shadow-sm">
                  <span className="font-bold text-slate-800 group-hover:text-blue-600">Ecosystem</span>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Integrations</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="bg-white/60 border border-white backdrop-blur-2xl p-10 md:p-14 rounded-3xl shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Live Intent Feed</span>
                  <div className="flex gap-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span></div>
                </div>
                <h3 className="text-3xl md:text-4xl font-semibold leading-snug tracking-tight text-slate-800 mb-6">
                  Track liquidity movements on the Pacifica DEX.
                </h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-slate-500 text-base leading-relaxed">
                  Identify high-volume trades, monitor whale addresses, and anticipate market trends with our institutional-grade intent engine.
                </p>
                
                <button 
                  onClick={onLaunch}
                  className="w-full py-4 text-center bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                >
                  Enter the Dashboard
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;