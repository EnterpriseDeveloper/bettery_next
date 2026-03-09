"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useWalletStore } from "../../store/useWalletStore";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, balance, isConnected, connect } = useWalletStore();

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener("keydown", onEscape);
      return () => document.removeEventListener("keydown", onEscape);
    }
  }, [mobileMenuOpen]);

  const fetchBalance = async () => {
    const balance = await fetch(`/api/balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    const balanceData = await balance.json();
    console.log("Fetched balance:", balanceData.balance);
    return balanceData;
  };

  useEffect(() => {
    console.log("Wallet store state changed:");
    const checkWallet = async () => {
      await connect();
      if (address) {
        console.log("Connected address:", address);
        const balanceData = await fetchBalance();
        useWalletStore.getState().setBalance(balanceData.balance);
      }
    };
    checkWallet();
  }, [address, connect]);

  const letsMintToken = async () => {
    if (address) {
      console.log("Connected address:", address);
      try {
        await fetch(`/api/mint`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
        const balanceData = await fetchBalance();
        useWalletStore.getState().setBalance(balanceData.balance);
      } catch (error) {
        console.log("Error minting token:", error);
      }
    }
  };

  return (
    <header className="bg-gray-900">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Bettery</span>
            <Image
              width={32}
              height={32}
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Menu aria-hidden className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link className="text-sm/6 font-semibold text-white" href="/app">
            Events
          </Link>
          <Link className="text-sm/6 font-semibold text-white" href="/create">
            Create
          </Link>
          <Link className="text-sm/6 font-semibold text-white" href="/bridge">
            Bridge
          </Link>
          {isConnected ? (
            <div className="text-sm/6 font-semibold text-white">
              <p>Address: {address}</p>
              <p>Balance: {balance} BET</p>
              {balance === "0" && (
                <button
                  type="button"
                  className="text-sm/6 font-semibold text-white"
                  onClick={() => letsMintToken()}
                >
                  mint token
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="text-sm/6 font-semibold text-white"
              onClick={() => letsMintToken()}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu - Tailwind only */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-50 bg-black/20"
            aria-hidden
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="-m-1.5 p-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Bettery</span>
                <Image
                  width={32}
                  height={32}
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-white"
                aria-label="Close menu"
              >
                <X aria-hidden className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  <Link
                    href="/app"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    Events
                  </Link>
                  <Link
                    href="/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    Create
                  </Link>
                  <Link
                    href="/bridge"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    Bridge
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
