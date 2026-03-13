"use client";

import Link from "next/link";
import { X } from "lucide-react";

type BetModalProps = {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
};

export default function BetModal({ open, onClose, onProceed }: BetModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="zero-amount-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-xl dark:border-white/10 dark:bg-gray-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2
              id="zero-amount-modal-title"
              className="text-lg font-bold text-white"
            >
              Participate for free
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              You can always participate for free — and you can still win money.
              Would you like to proceed with 0 amount or add funds first?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onProceed}
                className="rounded-xl border border-[#3CE6FF]/50 bg-[#3CE6FF]/10 px-4 py-2.5 text-sm font-bold text-[#3CE6FF] transition hover:bg-[#3CE6FF]/20"
              >
                Proceed
              </button>
              <Link
                href="/deposit"
                onClick={onClose}
                className="rounded-xl bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] px-4 py-2.5 text-center text-sm font-bold text-white shadow-md transition hover:brightness-110"
              >
                Deposit
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
