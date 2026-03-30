"use client";

import React, { useState } from "react";
import LandingPage from "@/components/LandingPage";
import ExchangeUI from "@/components/ExchangeUI";

export default function Home() {
  const [hasLaunched, setHasLaunched] = useState(false);

  return (
    <main>
      {hasLaunched ? (
        <ExchangeUI />
      ) : (
        <LandingPage onLaunch={() => setHasLaunched(true)} />
      )}
    </main>
  );
}