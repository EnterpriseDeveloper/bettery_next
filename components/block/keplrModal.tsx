"use client";

import { X } from "lucide-react";

const KEPLR_URL = "https://www.keplr.app/download";

type KeplrModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function KeplrModal({ open, onClose }: KeplrModalProps) {
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
        aria-labelledby="keplr-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="keplr-modal-title"
              className="text-lg font-bold text-white"
            >
              Keplr wallet required
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              This app uses the Keplr wallet to connect to the Cosmos
              ecosystem. Please install the Keplr browser extension to use
              the wallet features (connect, deposit, withdraw, create
              events).
            </p>
            <div className="mt-4 flex justify-center">
              <a
                href={KEPLR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 transition"
              >
                Install Keplr
              </a>
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
