"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useWalletStore } from "../../store/useWalletStore";

type Theme = "light" | "dark";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fundsOpen, setFundsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    const stored = window.localStorage.getItem("theme") as Theme | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return stored ?? (prefersDark ? "dark" : "light");
  });
  const { address, balance, isConnected, connect } = useWalletStore();

  // Sync theme to document + localStorage whenever it changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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
          <Link href="/app" className="flex items-center">
            <Image
              src="/logo.png"
              alt="BetMe logo"
              width={200}
              height={60}
              priority
            />
          </Link>
        </div>
        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Menu aria-hidden className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          <Link
            href="/app"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="/create"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Create
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFundsOpen((o) => !o)}
              className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Funds
              <span
                className={`text-xs transition-transform ${
                  fundsOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>
            {fundsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setFundsOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-white/10 bg-black/90 py-1 shadow-lg">
                  <Link
                    href="/deposit"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setFundsOpen(false)}
                  >
                    Deposit
                  </Link>
                  <Link
                    href="/withdraw"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setFundsOpen(false)}
                  >
                    Withdraw
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="text-xs font-semibold text-white text-right">
                <p className="truncate max-w-[180px]">Address: {address}</p>
                <p>Balance: {balance} BET</p>
              </div>
            ) : null}
            <button
              type="button"
              className="rounded-full bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 transition"
              onClick={() => letsMintToken()}
            >
              {isConnected ? "Mint BET" : "Connect Wallet"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
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
              <Link href="/app" className="flex items-center">
                <Image
                  src="/icon.png"
                  alt="BetMe logo"
                  width={32}
                  height={32}
                  priority
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
                    className="-mx-3 block rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Events
                  </Link>
                  <Link
                    href="/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Create
                  </Link>
                  <Link
                    href="/deposit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Deposit
                  </Link>
                  <Link
                    href="/withdraw"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Withdraw
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
