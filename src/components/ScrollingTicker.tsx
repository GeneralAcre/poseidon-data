"use client";

import React from 'react';

const ScrollingTicker = () => {
  const tickerText = " • POSEIDON'S EYE ACTIVE • WHALE INTENT DETECTED • PACIFICA MAINNET LIVE • SYSTEM STABLE • 🦝 RACCOON MODE ENABLED • ";

  return (
    <div className="w-full bg-slate-900 text-[#f5ebe0] py-4 overflow-hidden whitespace-nowrap border-b border-slate-800 relative z-[100] select-none">
      <div className="flex animate-marquee">
        {/* We render the text multiple times to ensure it covers the whole screen width during the loop */}
        <div className="flex shrink-0 items-center">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">{tickerText}</span>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">{tickerText}</span>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">{tickerText}</span>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">{tickerText}</span>
        </div>
        <div className="flex shrink-0 items-center">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">{tickerText}</span>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">{tickerText}</span>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">{tickerText}</span>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">{tickerText}</span>
        </div>
      </div>
    </div>
  );
};

export default ScrollingTicker;