"use client";
import { useWalletStore } from "../../store/useWalletStore";
import { txWithdrawal } from "@/blockchain/cosmos/bridge";
import Navbar from "@/components/block/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";
import { parseUnits } from "viem";

import { useState } from "react";

export default function Page() {
  const [amount, setAmount] = useState("0");
  const { address: cosmosAddress, signer } = useWalletStore();
  const { address: evmAddress, isConnected } = useAccount();
  const chainId = useChainId();

  const setWithdrawal = async (amount: string) => {
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
    // TODO for prod only, remove this
    if (chainId === 80002) {
      console.log("User on Amoy");
      return;
    }
    console.log("Withdrawing", {
      from: cosmosAddress,
      evmAddress,
      chainId,
      amount,
    });
    const amountBigInt = parseUnits(amount, 6);
    await txWithdrawal(signer, cosmosAddress, evmAddress, amountBigInt);
  };
  return (
    <div>
      <Navbar />
      <div>
        <label className="block text-sm/6 font-medium text-white">
          Receiver:
        </label>
        <ConnectButton />
        <label className="block text-sm/6 font-medium text-white">
          Amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          required
        />
      </div>
      <button
        onClick={() => setWithdrawal(amount)}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Withdrawal
      </button>
    </div>
  );
}
