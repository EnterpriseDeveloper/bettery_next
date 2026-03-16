"use client";

import { notFound } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart2,
  Calendar,
  CalendarCheck,
  Users,
  ShieldCheck,
  Hash,
  User,
  Info,
} from "lucide-react";
import { parseUnits } from "viem";
import Navbar from "@/components/block/navbar";
import BetModal from "@/components/modals/betModal";
import { useWalletStore } from "@/store/useWalletStore";
import {
  txIncreasePart,
  txParticipateEvent,
} from "@/blockchain/cosmos/participate";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

interface EventFromApi {
  id: string;
  question: string;
  answers: string[];
  answersPool: string[];
  startTime: string;
  endTime: string;
  category: string;
  status: string;
  roomId: string;
  creator: string;
  createdAt: string;
  bets: {
    id: string;
    creator: string;
    answer: string;
    amount: string;
    token: string;
    status: string;
  }[];
  validators: { id: string; creator: string; answer: string }[];
}

function formatDate(timestamp: bigint | string): string {
  const n =
    typeof timestamp === "string" ? Number(timestamp) : Number(timestamp);
  return new Date(n * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAmountUsdt(value: EventFromApi["bets"]): string {
  const n = value.reduce((acc, bet) => acc + Number(bet.amount), 0);
  const scaled = n / 100;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(scaled);
}

function formatUsdt(value: bigint | string): string {
  const n = typeof value === "string" ? Number(value) : Number(value);
  const scaled = n / 100;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(scaled);
}

export default function EventPage({ params }: EventPageProps) {
  const { address, signer } = useWalletStore();
  const [event, setEvent] = useState<EventFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundEvent, setNotFoundEvent] = useState(false);
  const [amount, setAmount] = useState("");
  const [increaseAmount, setIncreaseAmount] = useState("");
  const [walletError, setWalletError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [zeroAmountModal, setZeroAmountModal] = useState<{
    open: boolean;
    pending: { answerIndex: number } | null;
  }>({ open: false, pending: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { id } = await params;
      const res = await fetch(`/api/events/${id}`, { cache: "no-store" });
      if (cancelled) return;
      if (!res.ok) {
        setNotFoundEvent(true);
        setLoading(false);
        return;
      }
      const eventData = await res.json();
      setEvent(eventData);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (address) setWalletError("");
  }, [address]);

  const refetchEvent = useCallback(async (eventId: string) => {
    const res = await fetch(`/api/events/${eventId}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setEvent(data);
  }, []);

  const handleSubmitAnswer = useCallback(
    async (
      eventId: string,
      answers: string[],
      answerIndex: number,
      stakeAmount: string,
    ) => {
      setWalletError("");
      if (!signer || !address) {
        setWalletError("Connect your wallet to place a bet.");
        return;
      }
      const answer = answers[answerIndex];
      if (answer == null) return;
      if (!stakeAmount || Number(stakeAmount) <= 0) {
        setZeroAmountModal({ open: true, pending: { answerIndex } });
        return;
      }
      setSubmitting(true);
      try {
        const amountBigInt = parseUnits(stakeAmount, 6);
        await txParticipateEvent(
          signer,
          address,
          Number(eventId),
          answer,
          amountBigInt,
        );
        await refetchEvent(eventId);
        setAmount("");
        setIncreaseAmount("");
      } finally {
        setSubmitting(false);
      }
    },
    [signer, address, refetchEvent],
  );

  const handleIncreaseAnswer = useCallback(
    async (eventId: string, amount: string, partId: number) => {
      setWalletError("");
      if (!signer || !address) {
        setWalletError("Connect your wallet to increase your bet.");
        return;
      }
      try {
        const amountBigInt = parseUnits(amount, 6);
        await txIncreasePart(
          signer,
          address,
          partId,
          Number(eventId),
          amountBigInt,
        );
        await refetchEvent(eventId);
        setIncreaseAmount("");
      } finally {
        setSubmitting(false);
      }
    },
    [signer, address, refetchEvent],
  );

  const handleProceedWithZero = useCallback(
    async (eventId: string, answers: string[], pendingAnswerIndex: number) => {
      if (!signer || !address) {
        setZeroAmountModal({ open: false, pending: null });
        return;
      }
      const answer = answers[pendingAnswerIndex];
      if (answer == null) {
        setZeroAmountModal({ open: false, pending: null });
        return;
      }
      setZeroAmountModal({ open: false, pending: null });
      setSubmitting(true);
      try {
        await txParticipateEvent(signer, address, Number(eventId), answer, 0n);
        await refetchEvent(eventId);
      } finally {
        setSubmitting(false);
      }
    },
    [signer, address, refetchEvent],
  );

  const closeZeroModal = useCallback(() => {
    setZeroAmountModal({ open: false, pending: null });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] dark:bg-[#0a0b10] flex items-center justify-center text-slate-500 dark:text-slate-400">
        Loading event…
      </div>
    );
  }

  if (notFoundEvent || !event) {
    notFound();
  }

  const totalPool = event.answersPool.reduce<bigint>(
    (sum, pool) => sum + BigInt(pool),
    0n,
  );
  const totalPoolFormatted = formatUsdt(totalPool);
  const participantCount = event.bets.length;
  const validatorCount = event.validators.length;

  const statusStyles =
    event.status.toUpperCase() === "ACTIVE"
      ? "bg-[#3CE6FF]/10 dark:bg-[#3CE6FF]/20 border-[#3CE6FF]/30 dark:border-[#3CE6FF]/40 text-[#3CE6FF]"
      : "bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 text-slate-600 dark:text-slate-400";

  const isUserBet = (answer: string) =>
    address &&
    event.bets.some((b) => b.creator === address && b.answer === answer);

  const userBet = address
    ? event.bets.filter((b) => b.creator === address)
    : null;

  const isActive = event.status.toUpperCase() === "ACTIVE";

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1c1c1c] dark:bg-[#0a0b10] dark:text-slate-100">
      <Navbar />
      <BetModal
        open={zeroAmountModal.open}
        onClose={closeZeroModal}
        onProceed={() => {
          if (zeroAmountModal.pending != null) {
            void handleProceedWithZero(
              event.id,
              event.answers,
              zeroAmountModal.pending.answerIndex,
            );
          }
        }}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-6">
        <nav className="mb-6">
          <Link
            href="/app"
            className="flex items-center gap-2 text-sm font-medium text-[#9A6BFF] dark:text-[#9A6BFF] hover:text-[#7c4fd9] dark:hover:text-[#b07fff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column: main content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Event header */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[300px]">
                  <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2 text-[#1c1c1c] dark:text-white">
                    {event.question}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
                    <span className="font-mono">Event ID: #{event.id}</span>
                    <span className="h-1 w-1 bg-slate-300 dark:bg-slate-500 rounded-full" />
                    <span>
                      Category:{" "}
                      <span className="text-[#9A6BFF] dark:text-[#9A6BFF] font-semibold">
                        {event.category}
                      </span>
                    </span>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${statusStyles}`}
                >
                  {event.status}
                </span>
              </div>
            </section>

            {/* Answers */}
            <section className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1c1c1c] dark:text-white">
                <BarChart2 className="w-5 h-5 text-[#9A6BFF] dark:text-[#9A6BFF]" />
                Answers
              </h2>
              <div className="space-y-6">
                {event.answers.map((answer, index) => {
                  const rawPool = event.answersPool[index];
                  const pool = rawPool != null ? BigInt(rawPool) : 0n;
                  const percentage =
                    totalPool > 0n ? Number((pool * 100n) / totalPool) : 0;
                  const isUser = isUserBet(answer);
                  return (
                    <div
                      key={index}
                      className={`space-y-3 ${!isUser ? "opacity-70 dark:opacity-80" : ""}`}
                    >
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg font-bold text-[#1c1c1c] dark:text-white">
                            {answer}
                          </span>
                          {isUser && (
                            <span className="text-xs font-bold text-white bg-[#9A6BFF] dark:bg-[#9A6BFF] px-2 py-0.5 rounded">
                              YOUR BET
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="block text-2xl font-bold text-[#1c1c1c] dark:text-white">
                            {percentage.toFixed(0)}%
                          </span>
                          <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                            {formatUsdt(pool)} USDT Stake
                          </span>
                        </div>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#9A6BFF] to-[#3CE6FF] dark:from-[#9A6BFF] dark:to-[#3CE6FF] shadow-[0_0_10px_rgba(58,230,255,0.3)]"
                          style={{ width: `${Math.max(percentage, 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Participate — only when event is active */}
              {isActive && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
                  {walletError && (
                    <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
                      {walletError}
                    </div>
                  )}
                  {userBet ? (
                    <>
                      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 mb-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Your bet
                        </p>
                        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-lg font-bold text-[#9A6BFF] dark:text-[#9A6BFF]">
                            {userBet[0].answer}
                          </span>
                          <span className="font-bold text-[#1c1c1c] dark:text-white">
                            {formatAmountUsdt(userBet)}{" "}
                            {userBet[0].token || "USDT"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Add amount (USDT)"
                          value={increaseAmount}
                          onChange={(e) => {
                            const value = e.target.value.replace(",", ".");
                            const match = value.match(
                              /^(\d+)?(\.(\d{0,2})?)?$/,
                            );
                            if (match || value === "") setIncreaseAmount(value);
                          }}
                          className="w-40 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-[#1c1c1c] dark:text-slate-100"
                        />
                        <button
                          type="button"
                          disabled={
                            submitting ||
                            !increaseAmount ||
                            Number(increaseAmount) <= 0
                          }
                          onClick={() => {
                            const idx = event.answers.indexOf(
                              userBet[0].answer,
                            );
                            if (
                              idx >= 0 &&
                              increaseAmount &&
                              Number(increaseAmount) > 0
                            ) {
                              handleIncreaseAnswer(
                                event.id,
                                increaseAmount,
                                Number(userBet[0].id),
                              );
                            }
                          }}
                          className="cursor-pointer rounded-xl bg-[#9A6BFF] dark:bg-[#9A6BFF] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                        >
                          {submitting ? "Submitting…" : "Increase stake"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Amount (USDT)
                      </label>
                      <div className="relative mb-4">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={amount}
                          onChange={(e) => {
                            const value = e.target.value.replace(",", ".");
                            const match = value.match(
                              /^(\d+)?(\.(\d{0,2})?)?$/,
                            );
                            if (match || value === "") setAmount(value);
                          }}
                          placeholder="0"
                          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-3 pl-4 pr-14 text-[#1c1c1c] dark:text-slate-100 outline-none focus:border-[#9A6BFF] focus:ring-2 focus:ring-[#9A6BFF]/20"
                        />
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                          USDT
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {event.answers.map((answer, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={submitting}
                            onClick={() => {
                              if (!address) {
                                setWalletError(
                                  "Connect your wallet to place a bet.",
                                );
                                return;
                              }
                              setWalletError("");
                              handleSubmitAnswer(
                                event.id,
                                event.answers,
                                idx,
                                amount,
                              );
                            }}
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
                    </>
                  )}
                </div>
              )}
            </section>

            {/* Schedule */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-[#9A6BFF]/10 dark:bg-[#9A6BFF]/20 flex items-center justify-center text-[#9A6BFF] dark:text-[#9A6BFF]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Start Time
                  </p>
                  <p className="text-base font-bold text-[#1c1c1c] dark:text-white">
                    {formatDate(event.startTime)}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-[#3CE6FF]/10 dark:bg-[#3CE6FF]/20 flex items-center justify-center text-[#3CE6FF] dark:text-[#3CE6FF]">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    End Time
                  </p>
                  <p className="text-base font-bold text-[#1c1c1c] dark:text-white">
                    {formatDate(event.endTime)}
                  </p>
                </div>
              </div>
            </section>

            {/* Recent participants */}
            <section className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/10">
                <h2 className="text-lg font-bold text-[#1c1c1c] dark:text-white">
                  Recent Participants
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/10">
                {event.bets.slice(0, 5).map((bet) => (
                  <div
                    key={bet.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold font-mono text-[#1c1c1c] dark:text-white">
                          {bet.creator.slice(0, 6)}...{bet.creator.slice(-4)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {bet.answer}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1c1c1c] dark:text-white">
                        {formatUsdt(bet.amount)} {bet.token || "USDT"}
                      </p>
                      <p className="text-[10px] font-bold text-[#3CE6FF] dark:text-[#3CE6FF] uppercase tracking-wider">
                        Staked
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {event.bets.length > 5 && (
                <button
                  type="button"
                  className="w-full py-4 text-sm font-bold text-[#9A6BFF] dark:text-[#9A6BFF] hover:bg-[#9A6BFF]/5 dark:hover:bg-[#9A6BFF]/10 transition-colors"
                >
                  View All Participants
                </button>
              )}
            </section>
          </div>

          {/* Right column: sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Event summary */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3CE6FF]/5 dark:bg-[#3CE6FF]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h2 className="text-lg font-bold mb-6 border-b border-slate-100 dark:border-white/10 pb-3 text-[#1c1c1c] dark:text-white">
                Event Summary
              </h2>
              <div className="space-y-5 relative">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    Total Pool
                  </span>
                  <span className="text-xl font-black text-[#9A6BFF] dark:text-[#9A6BFF]">
                    {totalPoolFormatted} USDT
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    Participants
                  </span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#9A6BFF] dark:text-[#9A6BFF]" />
                    <span className="font-bold text-[#1c1c1c] dark:text-white">
                      {participantCount}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    Validators
                  </span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#3CE6FF] dark:text-[#3CE6FF]" />
                    <span className="font-bold text-[#1c1c1c] dark:text-white">
                      {validatorCount} Active
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    Room ID
                  </span>
                  <span className="font-mono text-sm font-bold px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded">
                    {event.roomId || `#${event.id}`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="w-full mt-8 py-3 rounded-lg bg-[#9A6BFF] dark:bg-[#9A6BFF] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#9A6BFF]/20 dark:shadow-[#9A6BFF]/30"
              >
                Join Discussion
              </button>
            </div>

            {/* Creator card */}
            <div className="bg-slate-900 dark:bg-slate-800/80 text-white p-6 rounded-xl border border-slate-800 dark:border-slate-700 shadow-xl">
              <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                Creator
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-lg bg-[#9A6BFF]/20 flex items-center justify-center border border-[#9A6BFF]/30">
                  <Hash className="w-6 h-6 text-[#9A6BFF]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#3CE6FF] dark:text-[#3CE6FF] break-all">
                    {event.creator.slice(0, 6)}...{event.creator.slice(-4)}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Platform Creator
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 dark:border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Created On
                </span>
                <span className="text-sm font-bold">
                  {event.createdAt
                    ? new Date(event.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>

            {/* Market resolution */}
            <div className="p-6 rounded-xl border border-[#9A6BFF]/20 dark:border-[#9A6BFF]/30 bg-[#9A6BFF]/5 dark:bg-[#9A6BFF]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#9A6BFF] dark:text-[#9A6BFF]">
                <Info className="w-5 h-5" />
                <h3 className="text-sm font-bold">Market Resolution</h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Resolution will be based on verifiable outcomes. When the event
                end time is reached, the winning answer is determined by the
                validators and the total pool is distributed to the correct
                side.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
