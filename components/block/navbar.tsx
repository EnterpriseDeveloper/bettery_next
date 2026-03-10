"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useWalletStore } from "../../store/useWalletStore";

type Theme = "light" | "dark";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const { address, balance, isConnected, connect } = useWalletStore();

  // Initialize theme from localStorage or prefers-color-scheme
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("theme") as Theme | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      if (typeof window !== "undefined") {
        window.localStorage.setItem("theme", next);
      }
      return next;
    });
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
          <Link className="text-sm/6 font-semibold text-white" href="/app">
            Events
          </Link>
          <Link className="text-sm/6 font-semibold text-white" href="/create">
            Create
          </Link>
          <Link className="text-sm/6 font-semibold text-white" href="/bridge">
            Bridge
          </Link>
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
