"use client";
import { useState } from 'react';
import ExchangeUI from '../components/ExchangeUI';
import LandingPage from '../components/LandingPage';
import ScrollingTicker from '../components/ScrollingTicker';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollingTicker />
      
      {!showDashboard ? (
        <LandingPage onLaunch={() => setShowDashboard(true)} />
      ) : (
        <div className="relative grow">
          <button 
            onClick={() => setShowDashboard(false)}
            className="fixed top-20 left-6 z-50 px-4 py-2 bg-white/80 hover:bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded shadow-sm backdrop-blur-md transition-all"
          >
            ← EXIT TERMINAL
          </button>
          <ExchangeUI />
        </div>
      )}
    </div>
  );
}