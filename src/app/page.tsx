"use client";
import { useState } from 'react';
import ExchangeUI from '../components/ExchangeUI';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (!showDashboard) {
    return (
      <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
        {/* Pacifica-style Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10">
          <div className="mb-4 inline-block px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold tracking-widest uppercase">
            Institutional Intent Engine
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
            POSEIDON'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">EYE</span>
          </h1>
          
          <p className="text-slate-400 max-w-xl mb-10 text-lg md:text-xl font-light leading-relaxed">
            Real-time whale intent tracking for the <span className="text-white font-medium">Pacifica Ecosystem</span>. 
            Identify liquidity shifts before the market moves.
          </p>
          
          <button 
            onClick={() => setShowDashboard(true)}
            className="group relative px-10 py-4 bg-white text-black font-bold rounded-sm transition-all hover:bg-emerald-400 active:scale-95"
          >
            LAUNCH TERMINAL
            <span className="absolute -bottom-2 -right-2 w-full h-full border border-white/20 group-hover:border-emerald-400/50 transition-colors -z-10"></span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="relative">
      {/* Back Button - Fixed to top left */}
      <button 
        onClick={() => setShowDashboard(false)}
        className="fixed top-6 left-6 z-50 px-4 py-2 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-bold rounded flex items-center gap-2 backdrop-blur-md transition-all"
      >
        ← EXIT TERMINAL
      </button>
      <ExchangeUI />
    </div>
  );
}