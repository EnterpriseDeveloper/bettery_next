import { useWalletStore } from "@/store/useWalletStore";

/**
 * Fetches user balance from API and updates the wallet store.
 * Same logic as navbar's fetchBalance + setBalance.
 */
export async function refreshWalletBalance(address: string): Promise<void> {
  const res = await fetch(`/api/balance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });
  const data = await res.json();
  useWalletStore.getState().setBalance(data.balance ?? "0");
}
