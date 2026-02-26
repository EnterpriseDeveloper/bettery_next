"use client";
import Bridge from "@/components/block/bridge";
import { useWalletStore } from "../../store/useWalletStore";
import { txWithdrawal } from "@/tx/bridge";
import Navbar from "@/components/block/navbar";
export default function Page() {
  const { address, signer } = useWalletStore();

  const setWithdrawal = async (receiver: string, amount: string) => {
    await txWithdrawal(signer!, address!, receiver, amount);
  };
  return (
    <div>
      <Navbar />
      <Bridge setWithdrawal={setWithdrawal} />
    </div>
  );
}
