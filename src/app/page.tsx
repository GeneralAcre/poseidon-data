import ExchangeUI from '@/components/exchangeUI';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* This is the component we just fixed! */}
        <ExchangeUI />
      </div>
    </main>
  );
}