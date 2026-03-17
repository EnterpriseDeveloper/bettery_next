"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "@/app/page.module.css";

const ENABLE_APP =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_ENABLE_APP === "true";

export function LaunchAppButton() {
  const [open, setOpen] = useState(false);

  const className =
    styles.btnPrimary +
    " inline-flex items-center gap-2 px-8 py-3 text-[16px] cursor-pointer";

  if (ENABLE_APP) {
    return (
      <Link href="/app" className={className}>
        Launch App
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Launch App
        <ArrowRight className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-[#0B1020] to-[#050713] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white"
            >
              Esc
            </button>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3CE6FF]/30 bg-[#3CE6FF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#3CE6FF]">
              Coming soon
            </div>

            <h2 className="mb-2 text-xl font-semibold text-white">
              BetMe App is in private beta
            </h2>

            <p className="mb-4 text-sm text-white/70">
              We&apos;re polishing the on-chain experience before opening it to
              everyone. You can follow the project and reach out if you&apos;d
              like early access or to collaborate.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a
                href="https://www.linkedin.com/in/maksim-voroshilov-063652177/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Connect on LinkedIn
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#070B14] hover:bg-slate-100"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
