"use client";
import { useWalletStore } from "../../store/useWalletStore";
import Navbar from "@/components/block/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";
import { useWriteContract } from "wagmi";
import { erc20Abi } from "viem";
import { useState } from "react";
import { parseEther } from "viem";
import bridgeAbi from "@/blockchain/evm/BridgeABI.json";

export default function Page() {
  const [amount, setAmount] = useState<string>("0");
  const { address: cosmosAddress, signer } = useWalletStore();
  const { address: evmAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract } = useWriteContract();

  const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_EVM_TOKEN as `0x${string}`;
  const BRIDGE_ADDRESS = process.env.NEXT_PUBLIC_EVM_BRIDGE as `0x${string}`;

  const setDeposit = async () => {
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
    console.log("Depositing", {
      from: cosmosAddress,
      evmAddress,
      chainId,
      amount,
    });

    const amountInBigInt = parseEther(amount);

    await writeContract({
      address: TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [BRIDGE_ADDRESS, amountInBigInt],
    });

    await writeContract({
      address: BRIDGE_ADDRESS,
      abi: bridgeAbi,
      functionName: "lock",
      args: [TOKEN_ADDRESS, amountInBigInt, cosmosAddress],
    });
  };
  return (
    <div>
      <Navbar />
      <div>
        <label className="block text-sm/6 font-medium text-white">
          EVM Address:
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
        onClick={() => setDeposit()}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Deposit
      </button>
    </div>
  );
}
