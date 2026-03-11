"use client";

import { useWalletStore } from "../../store/useWalletStore";
import { txWithdrawal } from "@/blockchain/cosmos/bridge";
import Navbar from "@/components/block/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from "wagmi";
import { useState } from "react";
import { parseUnits } from "viem";
import {
  Network,
  Sparkles,
  ArrowRight,
  Info,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const WITHDRAWAL_FEE_USDT = 1;

export default function Page() {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { address: cosmosAddress, signer, balance } = useWalletStore();
  const { address: evmAddress, isConnected } = useAccount();
  const chainId = useChainId();

  const handleWithdraw = async () => {
    if (!signer || !cosmosAddress) {
      console.warn("COSMOS SDK wallet is not connected");
      return;
    }
    if (!evmAddress || !isConnected) {
      console.warn("EVM wallet is not connected");
      return;
    }
    if (!chainId) {
      console.warn("Chain ID is not set");
      return;
    }
    if (chainId === 80002) {
      console.log("User on Amoy");
      return;
    }
    const num = amount.trim();
    if (!num || Number.isNaN(Number(num)) || Number(num) <= 0) {
      return;
    }
    const amountNum = Number(num);
    if (amountNum <= WITHDRAWAL_FEE_USDT) {
      return;
    }
    setSubmitting(true);
    try {
      const amountBigInt = parseUnits(num, 6); // USDT 6 decimals
      await txWithdrawal(signer, cosmosAddress, evmAddress, amountBigInt);
    } finally {
      setSubmitting(false);
    }
  };

  const setMax = () => {
    // Optional: use Cosmos balance from store; ensure > fee
    const bal = balance ? Number(balance) : 0;
    if (bal > WITHDRAWAL_FEE_USDT) {
      setAmount(String(bal - WITHDRAWAL_FEE_USDT));
    } else {
      setAmount("");
    }
  };

  const amountNum = amount.trim() ? Number(amount.trim()) : 0;
  const receiveAmount = amountNum > WITHDRAWAL_FEE_USDT ? amountNum - WITHDRAWAL_FEE_USDT : 0;
  const isValidAmount = amountNum > WITHDRAWAL_FEE_USDT;

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-[#f8f6f6] text-slate-900 dark:bg-[#0a0a0f] dark:text-slate-100 bg-grid-deposit">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full blur-[120px] -z-10 opacity-0 dark:opacity-20 bg-[#9A6BFF]" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full blur-[120px] -z-10 opacity-0 dark:opacity-20 bg-[#3CE6FF]" />

        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-[#9A6BFF] to-[#3CE6FF] dark:from-white dark:via-[#b026ff] dark:to-[#00d4ff]"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Withdraw USDT
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Bridge your assets from Cosmos to Polygon network.
            </p>
          </div>

          <div className="glass-panel-deposit p-8 rounded-2xl shadow-2xl relative overflow-hidden border border-slate-200 bg-white dark:border-transparent dark:bg-transparent">
            {/* Network indicator: Source = Cosmos, Target = Polygon */}
            <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-white/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full flex items-center justify-center bg-[#3CE6FF]/10 dark:bg-[#00d4ff]/20">
                  <Sparkles className="size-4 text-[#3CE6FF] dark:text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Source
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Cosmos betMe
                  </p>
                </div>
              </div>
              <ArrowRight className="size-5 shrink-0 text-[#3CE6FF] dark:text-[#00d4ff]" />
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full flex items-center justify-center bg-[#9A6BFF]/10 dark:bg-[#b026ff]/20">
                  <Network className="size-4 text-[#9A6BFF] dark:text-[#b026ff]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Target
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Polygon (ERC-20)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 px-1">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-5 pr-28 text-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9A6BFF]/20 focus:border-[#9A6BFF]/50 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-600 dark:focus:ring-[#b026ff]/50 dark:focus:border-[#b026ff]/50 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-slate-900 dark:text-white font-bold">
                      USDT
                    </span>
                    <button
                      type="button"
                      onClick={setMax}
                      className="text-xs font-bold uppercase px-2 py-1 rounded bg-[#9A6BFF]/10 text-[#9A6BFF] dark:bg-[#b026ff]/20 dark:text-[#b026ff] transition-colors hover:opacity-80"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl flex gap-3 border border-amber-500/30 bg-amber-500/10 dark:border-amber-400/20 dark:bg-amber-500/10">
                <Info className="size-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                  <p>
                    Each withdrawal costs{" "}
                    <span className="font-bold text-amber-700 dark:text-amber-300">
                      {WITHDRAWAL_FEE_USDT} USDT
                    </span>{" "}
                    (network fee). The remaining amount will be unlocked on{" "}
                    <span className="font-bold text-[#3CE6FF] dark:text-[#00d4ff]">
                      Polygon
                    </span>{" "}
                    and sent to your EVM wallet.
                  </p>
                  {isValidAmount && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      You will receive approximately{" "}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {receiveAmount.toFixed(2)} USDT
                      </span>{" "}
                      on Polygon.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400 px-1">
                  EVM wallet (receiver)
                </p>
                <ConnectButton />
              </div>

              <button
                type="button"
                onClick={handleWithdraw}
                disabled={submitting || !isValidAmount}
                className="w-full py-5 rounded-xl bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] text-white font-black text-lg uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg dark:text-[#0a0a0f] dark:neon-glow-purple disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? "Processing…" : "Withdraw USDT"}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <ShieldCheck className="size-4 shrink-0" />
              <span>
                We only support the Polygon network and ERC-20 USDT token.
              </span>
            </div>

            <div className="p-6 rounded-xl border border-red-200 bg-red-50 max-w-md w-full dark:border-red-500/30 dark:bg-red-500/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-tighter">
                    Critical Warning
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400/80 leading-relaxed italic">
                    This is a fully functional MVP. All money invested can be
                    lost after platform updates. Use at your own risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-slate-500 dark:text-slate-600 text-xs">
        <p>© 2024 betMe Ecosystem. Futuristic decentralized betting interface.</p>
      </footer>
    </div>
  );
}
