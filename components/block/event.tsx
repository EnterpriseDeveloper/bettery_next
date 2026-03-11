"use client";

import { useState } from "react";
import Link from "next/link";

type EventCardProps = {
  ev: {
    id: string | number;
    question: string;
    answers: string[];
    answersPool: string[];
    endTime: string;
    category: string;
    status?: string;
    bets?: { creator: string; answer: string; amount: string; token?: string }[];
  };
  currentAddress?: string | null;
  selected?: Record<string | number, number | null>;
  handleSelect?: (eventId: number | string, answerIndex: number) => void;
  handleSubmitAnswer?: (eventId: number | string, amount: string, answerIndex: number) => void;
};

function formatPool(pool: bigint): string {
  const n = Number(pool);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function endsInDays(endTimeStr: string): string {
  const endSec = Number(endTimeStr);
  const endMs = endSec * 1000;
  const now = Date.now();
  if (endMs <= now) return "Ended";
  const days = Math.ceil((endMs - now) / (24 * 60 * 60 * 1000));
  return `Ends in ${days} day${days !== 1 ? "s" : ""}`;
}

export default function EventCard({
  ev,
  currentAddress,
  selected = {},
  handleSelect,
  handleSubmitAnswer,
}: EventCardProps) {
  const [amount, setAmount] = useState("");
  const [increaseAmount, setIncreaseAmount] = useState("");

  const pools = (ev.answersPool ?? []).map((p) => BigInt(p));
  const totalPool = pools.reduce((s, p) => s + p, 0n);
  const percentages = ev.answers.map((_, i) =>
    totalPool > 0n
      ? Math.round(Number((pools[i] ?? 0n) * 100n) / Number(totalPool))
      : 0
  );

  const userBet = currentAddress && ev.bets?.find((b) => b.creator === currentAddress);
  const hasBet = !!userBet;

  const eventId = String(ev.id);
  const endsLabel = endsInDays(ev.endTime ?? "0");

  return (
    <article
      className={`rounded-2xl border p-6 shadow-sm transition ${
        hasBet
          ? "border-[#9A6BFF]/30 bg-white shadow-[0_0_20px_rgba(154,107,255,0.08)] dark:border-[#9A6BFF]/40 dark:bg-white/5 dark:shadow-[0_0_20px_rgba(154,107,255,0.15)]"
          : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
      }`}
    >
      {/* Header: category + ends | total pool */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              hasBet
                ? "bg-[#3CE6FF]/15 text-[#3CE6FF] border border-[#3CE6FF]/30 dark:bg-[#3CE6FF]/10 dark:border-[#3CE6FF]/20"
                : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400"
            }`}
          >
            {ev.category}
          </span>
          {hasBet && (
            <span className="rounded-full bg-[#9A6BFF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Your participation
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {endsLabel}
          </span>
        </div>
        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Total pool: {formatPool(totalPool)} USDT
        </div>
      </div>

      {/* Question */}
      <h2 className="mb-5 text-xl font-bold leading-snug text-slate-900 dark:text-white">
        {ev.question}
      </h2>

      {/* Progress bars */}
      <div className="space-y-3">
        {ev.answers.map((answer, idx) => (
          <div key={idx}>
            <div className="mb-1 flex justify-between text-sm">
              <span
                className={
                  idx % 2 === 0
                    ? "font-semibold text-[#3CE6FF]"
                    : "font-semibold text-[#9A6BFF]"
                }
              >
                {answer}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {percentages[idx] ?? 0}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percentages[idx] ?? 0}%`,
                  backgroundColor: idx % 2 === 0 ? "#3CE6FF" : "#9A6BFF",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {hasBet ? (
        <>
          {/* Your bet summary */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Your bet
            </p>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-lg font-bold text-[#9A6BFF]">
                {userBet!.answer}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Locked</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {userBet!.amount} {userBet!.token ?? "USDT"}
                </span>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {userBet && (
              <>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Add amount (USDT)"
                  value={increaseAmount}
                  onChange={(e) => setIncreaseAmount(e.target.value)}
                  className="w-40 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => {
                    const idx = ev.answers.indexOf(userBet.answer);
                    if (idx >= 0 && increaseAmount && Number(increaseAmount) > 0) {
                      handleSubmitAnswer?.(ev.id, increaseAmount, idx);
                      setIncreaseAmount("");
                    }
                  }}
                  className="rounded-xl bg-[#9A6BFF] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Increase stake
                </button>
              </>
            )}
            <Link
              href={`/event/${eventId}`}
              className="rounded-xl border-2 border-[#9A6BFF] bg-transparent px-5 py-2.5 text-sm font-bold text-[#9A6BFF] transition hover:bg-[#9A6BFF]/10 dark:text-white dark:border-white/30 dark:hover:bg-white/10"
            >
              Show details
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Amount input */}
          <div className="mt-5">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Amount (USDT)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="any"
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-14 text-slate-900 outline-none transition focus:border-[#9A6BFF] focus:ring-2 focus:ring-[#9A6BFF]/20 dark:border-white/10 dark:bg-black/40 dark:text-slate-100"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                USDT
              </span>
            </div>
          </div>
          {/* Bet buttons: one per answer, first = cyan, second = purple */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {ev.answers.map((answer, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleSelect?.(ev.id, idx);
                  handleSubmitAnswer?.(ev.id, amount, idx);
                }}
                disabled={!amount || Number(amount) <= 0}
                className={`rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:opacity-50 ${
                  idx % 2 === 0
                    ? "bg-[#3CE6FF] hover:opacity-90"
                    : "bg-[#9A6BFF] hover:opacity-90"
                }`}
              >
                Bet {answer}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <Link
              href={`/event/${eventId}`}
              className="inline-block rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Show details
            </Link>
          </div>
        </>
      )}
    </article>
  );
}
