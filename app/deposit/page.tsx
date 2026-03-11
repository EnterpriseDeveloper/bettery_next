"use client";
import { useWalletStore } from "../../store/useWalletStore";
import Navbar from "@/components/block/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";

export default function Page() {
  const { address, signer } = useWalletStore();
  const { address: evmAddress, isConnected } = useAccount();
  const chainId = useChainId();

  const setDeposit = async (amount: string) => {
    if (!signer || !address) {
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
      from: address,
      evmAddress,
      chainId,
      amount,
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
      </div>
    </div>
  );
}
