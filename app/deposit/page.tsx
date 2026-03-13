"use client";

import { useWalletStore } from "../../store/useWalletStore";
import Navbar from "@/components/block/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { erc20Abi, parseEther, parseGwei } from "viem";
import { useState } from "react";
import bridgeAbi from "@/blockchain/evm/BridgeABI.json";
import {
  Network,
  Sparkles,
  ArrowRight,
  Info,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import router from "next/router";

export default function Page() {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [walletError, setWalletError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { address: cosmosAddress, signer } = useWalletStore();
  const { address: evmAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_EVM_TOKEN as `0x${string}`;
  const BRIDGE_ADDRESS = process.env.NEXT_PUBLIC_EVM_BRIDGE as `0x${string}`;

  const handleDeposit = async () => {
    setWalletError("");
    if (!signer || !cosmosAddress) {
      setWalletError("Connect your Cosmos wallet before depositing.");
      return;
    }
    if (!evmAddress || !isConnected) {
      setWalletError("Connect your EVM wallet with the button above.");
      return;
    }
    if (!chainId) {
      console.warn("Chain ID is not set");
      return;
    }
    // TODO
    // if (chainId === 80002) {
    //   console.log("User on Amoy");
    //   return;
    // }
    const num = amount.trim();
    if (!num) {
      setAmountError("Please enter an amount.");
      return;
    }
    if (Number.isNaN(Number(num)) || Number(num) <= 0) {
      setAmountError("Amount must be greater than 0.");
      return;
    }
    setAmountError("");
    setSubmitting(true);
    try {
      // TODO: !IMPORTANT FIX GAS LIMITS FOR PROD !
      const amountWei = parseEther(num);
      await writeContractAsync({
        address: TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [BRIDGE_ADDRESS, amountWei],
        maxPriorityFeePerGas: parseGwei("30"),
        maxFeePerGas: parseGwei("40"),
        gas: 80000n,
      });
      await writeContractAsync({
        address: BRIDGE_ADDRESS,
        abi: bridgeAbi as never,
        functionName: "lock",
        args: [TOKEN_ADDRESS, amountWei, cosmosAddress],
        maxPriorityFeePerGas: parseGwei("30"),
        maxFeePerGas: parseGwei("40"),
        gas: 250000n,
      });
      router.push("/app");
    } finally {
      setSubmitting(false);
    }
  };

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
              Deposit USDT
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Bridge your assets from Polygon to Cosmos ecosystem.
            </p>
          </div>

          <div className="glass-panel-deposit p-8 rounded-2xl shadow-2xl relative overflow-hidden border border-slate-200 bg-white dark:border-transparent dark:bg-transparent">
            {/* Network indicator */}
            <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-white/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full flex items-center justify-center bg-[#9A6BFF]/10 dark:bg-[#b026ff]/20">
                  <Network className="size-4 text-[#9A6BFF] dark:text-[#b026ff]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Network
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Polygon (ERC-20)
                  </p>
                </div>
              </div>
              <ArrowRight className="size-5 shrink-0 text-[#3CE6FF] dark:text-[#00d4ff]" />
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full flex items-center justify-center bg-[#3CE6FF]/10 dark:bg-[#00d4ff]/20">
                  <Sparkles className="size-4 text-[#3CE6FF] dark:text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Target
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Cosmos betMe
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 px-1">
                  Amount to Deposit
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value.replace(",", ".");
                      // Allow empty, digits, optional dot, max 2 decimals
                      const match = value.match(/^(\d+)?(\.(\d{0,2})?)?$/);
                      if (!match && value !== "") return;
                      setAmount(value);
                      if (amountError && value) {
                        setAmountError("");
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-5 pr-28 text-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9A6BFF]/20 focus:border-[#9A6BFF]/50 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-600 dark:focus:ring-[#b026ff]/50 dark:focus:border-[#b026ff]/50 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-slate-900 dark:text-white font-bold">
                      USDT
                    </span>
                  </div>
                </div>
                {amountError && (
                  <p className="px-1 text-xs text-red-500 mt-1">
                    {amountError}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl flex gap-3 border border-[#3CE6FF]/20 bg-[#3CE6FF]/10 dark:border-[#00d4ff]/30 dark:bg-[#00d4ff]/10">
                <Info className="size-5 shrink-0 mt-0.5 text-[#3CE6FF] dark:text-[#00d4ff]" />
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  After depositing, the exact same amount will be minted on your{" "}
                  <span className="font-bold text-[#3CE6FF] dark:text-[#00d4ff]">
                    Cosmos BetMe
                  </span>{" "}
                  account instantly.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400 px-1">
                  EVM sender address
                </p>
                <ConnectButton />
                {walletError && (
                  <p className="px-1 text-xs text-red-500 mt-1">
                    {walletError}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleDeposit}
                disabled={submitting}
                className="cursor-pointer w-full py-5 rounded-xl bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] text-white font-black text-lg uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg dark:text-[#0a0a0f] dark:neon-glow-purple disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? "Processing…" : "Deposit USDT"}
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
    </div>
  );
}
